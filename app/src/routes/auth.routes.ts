import { Elysia, t } from "elysia";
import { AuthController } from "../controllers/auth.controller";

const authController = new AuthController();

export const authRoutes = (app: Elysia) =>
  app.group("/auth", (app) =>
    app
      .post("/register", async ({ body, set }) => {
        const result = await authController.register(body);
        set.headers['content-type'] = 'application/json';
        return result;
      }, {
        body: t.Object({
          email: t.String({ format: 'email' }),
          password: t.String({ minLength: 8 }),
          name: t.Optional(t.String())
        })
      })
      .post("/login", async ({ body, store: { jwt }, set }: any) => {
        const result = await authController.login(body);
        if (!result.success || !result.user) {
          set.headers['content-type'] = 'application/json';
          return result;
        }
        
        // Generate JWT token
        const token = await jwt.sign({
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        });
        
        set.headers['content-type'] = 'application/json';
        return {
          ...result,
          token,
        };
      }, {
        body: t.Object({
          email: t.String({ format: 'email' }),
          password: t.String()
        })
      })
      .post("/forgot-password", async ({ body, set }) => {
        const result = await authController.forgotPassword(body);
        set.headers['content-type'] = 'application/json';
        return result;
      }, {
        body: t.Object({
          email: t.String({ format: 'email' })
        })
      })
      .post("/reset-password", async ({ body, set }) => {
        const result = await authController.resetPassword(body);
        set.headers['content-type'] = 'application/json';
        return result;
      }, {
        body: t.Object({
          email: t.String({ format: 'email' }),
          token: t.String(),
          newPassword: t.String({ minLength: 8 })
        })
      })
  );
