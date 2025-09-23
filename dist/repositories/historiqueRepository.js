import { PrismaClient } from "@prisma/client";
import { mnprisma } from '../config/db.js';
export class HistoriqueRepository {
    async findAll() {
        return mnprisma.historique.findMany();
    }
    async findById(id) {
        return mnprisma.historique.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return mnprisma.historique.create({ data });
    }
    async update(id, data) {
        return mnprisma.historique.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.historique.delete({ where: { id } });
    }
}
//# sourceMappingURL=historiqueRepository.js.map