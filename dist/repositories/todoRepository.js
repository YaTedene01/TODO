import { PrismaClient } from "@prisma/client";
import { mnprisma } from '../config/db.js';
export class TodoRepository {
    async findAll() {
        return mnprisma.todo.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            }
        });
    }
    async findById(id) {
        return mnprisma.todo.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            }
        });
    }
    async create(data) {
        return mnprisma.todo.create({ data });
    }
    async update(id, data) {
        return mnprisma.todo.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.todo.delete({ where: { id } });
    }
    async shareTodo(todoId, userId, canEdit, canDelete) {
        return mnprisma.todoShare.create({
            data: {
                todoId,
                userId,
                canEdit,
                canDelete
            }
        });
    }
    async getTodoShare(todoId, userId) {
        return mnprisma.todoShare.findFirst({
            where: {
                todoId,
                userId
            }
        });
    }
}
//# sourceMappingURL=todoRepository.js.map