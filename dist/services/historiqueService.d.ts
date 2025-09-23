import type { Historique } from '@prisma/client';
export declare class HistoriqueService {
    private mnrepo;
    constructor();
    findAll(): Promise<{
        id: number;
        action: string;
        userId: number;
        todoId: number;
        timestamp: Date;
    }[]>;
    findById(id: number): Promise<{
        id: number;
        action: string;
        userId: number;
        todoId: number;
        timestamp: Date;
    } | null>;
    create(data: Omit<Historique, "id">): Promise<{
        id: number;
        action: string;
        userId: number;
        todoId: number;
        timestamp: Date;
    }>;
    update(id: number, data: Partial<Omit<Historique, "id">>): Promise<{
        id: number;
        action: string;
        userId: number;
        todoId: number;
        timestamp: Date;
    }>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=historiqueService.d.ts.map