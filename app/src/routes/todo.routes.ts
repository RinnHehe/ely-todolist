import { Elysia, t } from "elysia";
import { TodoController } from "../controllers/todo.controller";

const todoController = new TodoController();

export const todoRoutes = (app: Elysia) =>
  app.group("/todos", (app) =>
    app
      .derive(({ user, set }: any) => {
        if (!user?.id) {
          set.status = 401;
          throw new Error("Unauthorized");
        }
        return { userId: user.id as number };
      })
      .get("/", async ({ userId }) => {
        return await todoController.getAll(userId);
      })
      .post("/", async ({ userId, body }) => {
        return await todoController.create(userId, body);
      }, {
        body: t.Object({
          title: t.String({ minLength: 1 }),
          description: t.Optional(t.String()),
          completed: t.Optional(t.Boolean())
        })
      })
      .put("/:id", async ({ userId, params, body }) => {
        return await todoController.update(Number(params.id), userId, body);
      }, {
        params: t.Object({
          id: t.Numeric()
        }),
        body: t.Object({
          title: t.Optional(t.String({ minLength: 1 })),
          description: t.Optional(t.String()),
          completed: t.Optional(t.Boolean())
        })
      })
      .delete("/:id", async ({ userId, params }) => {
        return await todoController.delete(Number(params.id), userId);
      }, {
        params: t.Object({
          id: t.Numeric()
        })
      })
  );
