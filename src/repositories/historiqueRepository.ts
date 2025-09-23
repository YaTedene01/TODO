import { PrismaClient } from "@prisma/client";
import type { Historique } from "@prisma/client";
import type { InterfaceRepository } from "./InterfacRepository.js";
import { mnprisma } from '../config/db.js';

export class HistoriqueRepository implements InterfaceRepository<Historique>{

    async findAll(): Promise<Historique[]> {
        return mnprisma.historique.findMany();
    }

    async findById(id: number): Promise<Historique | null> {
        return mnprisma.historique.findUnique({
            where: { id },
        });
    }

    async create(data: Omit<Historique, "id">): Promise<Historique> {
        return mnprisma.historique.create({ data });
    }
    async update(id: number,data: Partial<Omit<Historique, "id" >> ): Promise<Historique> {
        return mnprisma.historique.update({ where: { id }, data });
    }

 async delete(id: number): Promise<void> {
        await mnprisma.historique.delete({ where: { id } });
    }

}
