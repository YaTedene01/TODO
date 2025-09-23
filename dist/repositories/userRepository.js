import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { mnprisma } from '../config/db.js';
export class UserRepository {
    async findAll() {
        return mnprisma.user.findMany({
            include: {
                todos: true,
            }
        });
    }
    async findById(id) {
        return mnprisma.user.findUnique({
            where: { id },
            include: {
                todos: true,
            }
        });
    }
    async create(data) {
        // Hash le mot de passe avant création
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const userData = { ...data, password: hashedPassword };
        return mnprisma.user.create({ data: userData });
    }
    async update(id, data) {
        return mnprisma.user.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.user.delete({ where: { id } });
    }
    async getSharedTodos(userId) {
        // Récupère tous les todos partagés avec cet utilisateur
        return mnprisma.todo.findMany({
            where: {
                shares: {
                    some: { userId }
                }
            },
            include: {
                user: true,
                shares: true
            }
        });
    }
}
//# sourceMappingURL=userRepository.js.map