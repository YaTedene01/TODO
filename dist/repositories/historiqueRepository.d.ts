import type { Historique } from "@prisma/client";
import type { InterfaceRepository } from "./InterfacRepository.js";
export declare class HistoriqueRepository implements InterfaceRepository<Historique> {
    findAll(): Promise<Historique[]>;
    findById(id: number): Promise<Historique | null>;
    create(data: Omit<Historique, "id">): Promise<Historique>;
    update(id: number, data: Partial<Omit<Historique, "id">>): Promise<Historique>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=historiqueRepository.d.ts.map