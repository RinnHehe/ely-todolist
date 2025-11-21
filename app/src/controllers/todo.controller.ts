import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TodoController {
  async getAll(userId: number) {
    return await prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(userId: number, body: { title: string; description?: string }) {
    const { title, description } = body;

    if (!title) {
      return { success: false, error: "Title required" };
    }

    const todo = await prisma.todo.create({
      data: { title, description, userId },
    });

    return { success: true, message: "Task created successfully!", todo };
  }

  async update(
    id: number,
    userId: number,
    body: Partial<{ title: string; description: string; completed: boolean }>
  ) {
    const { title, description, completed } = body;

    const existing = await prisma.todo.findFirst({ where: { id, userId } });
    if (!existing) {
      return { success: false, error: "Task not found" };
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        description: description ?? existing.description,
        completed: typeof completed === "boolean" ? completed : existing.completed,
      },
    });

    return { success: true, message: "Task updated successfully!", todo: updated };
  }

  async delete(id: number, userId: number) {
    const existing = await prisma.todo.findFirst({ where: { id, userId } });
    if (!existing) {
      return { success: false, error: "Task not found" };
    }

    await prisma.todo.delete({ where: { id } });
    return { success: true, message: "Task deleted successfully!" };
  }
}
