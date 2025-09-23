import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { mnprisma } from '../config/db.js';
import type { InterfaceRepository } from "./InterfacRepository.js";

export class UserRepository implements InterfaceRepository<any> {
    async findAll() {
        return mnprisma.user.findMany({
            include: {
                todos: true,
            }
        });
    }

    async findById(id: number) {
        return mnprisma.user.findUnique({
            where: { id },
            include: {
                todos: true,
            }
        });
    }

    async create(data: any) {
        // Hash le mot de passe avant création
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const userData = { ...data, password: hashedPassword };
        return mnprisma.user.create({ data: userData });
    }

    async update(id: number, data: any) {
        return mnprisma.user.update({ where: { id }, data });
    }

    async delete(id: number) {
        await mnprisma.user.delete({ where: { id } });
    }

    async getSharedTodos(userId: number) {
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