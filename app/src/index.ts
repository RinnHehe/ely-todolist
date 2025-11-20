import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";
import { jwt } from "@elysiajs/jwt";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

interface RegisterBody { email: string; password: string; name?: string }
interface LoginBody { email: string; password: string }
interface TodoBody { title: string; description?: string }

// Utility to require auth
const requireUser = async (ctx: any) => {
  const userId = ctx.user?.id;
  if (!userId) return ctx.set.status = 401, { error: "Unauthorized" };
  return userId as number;
}

const app = new Elysia()
  .use(jwt({ name: "jwt", secret: JWT_SECRET }))
  .derive(async ({ jwt, headers }) => {
    const auth = headers.authorization;
    if (!auth) return { user: null };
    const token = auth.replace("Bearer ", "");
    try {
      const payload = await jwt.verify(token);
      return { user: payload };
    } catch {
      return { user: null };
    }
  })
  .get("/", () => ({ message: "TODO API ready" }))
  // Auth: register
  .post("/auth/register", async ({ body }) => {
    const { email, password, name } = body as RegisterBody;
    if (!email || !password) return { error: "Missing email or password" };
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "Email already used" };
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash: hash, name } });
    return { id: user.id, email: user.email };
  })
  // Auth: login
  .post("/auth/login", async ({ body, jwt }) => {
    const { email, password } = body as LoginBody;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "Invalid credentials" };
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return { error: "Invalid credentials" };
    const token = await jwt.sign({ id: user.id, email: user.email, role: user.role });
    return { token };
  })
  // List todos (auth required)
  .get("/todos", async (ctx) => {
    const userId = await requireUser(ctx);
    if (typeof userId !== "number") return userId;
    const todos = await prisma.todo.findMany({ where: { userId } });
    return todos;
  })
  // Create todo
  .post("/todos", async ({ body, ...ctx }) => {
    const userId = await requireUser(ctx);
    if (typeof userId !== "number") return userId;
    const { title, description } = body as TodoBody;
    if (!title) return { error: "Title required" };
    const todo = await prisma.todo.create({ data: { title, description, userId } });
    return todo;
  })
  // Update todo
  .put("/todos/:id", async ({ params, body, ...ctx }) => {
    const userId = await requireUser(ctx);
    if (typeof userId !== "number") return userId;
    const id = Number(params.id);
    const { title, description, completed } = body as Partial<{ title: string; description: string; completed: boolean }>;
    const existing = await prisma.todo.findFirst({ where: { id, userId } });
    if (!existing) return { error: "Not found" };
    const updated = await prisma.todo.update({ where: { id }, data: { title: title ?? existing.title, description: description ?? existing.description, completed: typeof completed === "boolean" ? completed : existing.completed } });
    return updated;
  })
  // Delete todo
  .delete("/todos/:id", async ({ params, ...ctx }) => {
    const userId = await requireUser(ctx);
    if (typeof userId !== "number") return userId;
    const id = Number(params.id);
    const existing = await prisma.todo.findFirst({ where: { id, userId } });
    if (!existing) return { error: "Not found" };
    await prisma.todo.delete({ where: { id } });
    return { success: true };
  })
  .listen(3000);

console.log(`🦊 TODO API running at http://localhost:3000`);
console.log(`🔐 Auth endpoints: /auth/register /auth/login`);
console.log(`✅ Todos endpoints protected via Bearer token`);
