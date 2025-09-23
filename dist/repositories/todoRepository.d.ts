import type { todo } from "@prisma/client";
import type { InterfaceRepository } from "./InterfacRepository.js";
export declare class TodoRepository implements InterfaceRepository<todo> {
    findAll(): Promise<todo[]>;
    findById(id: number): Promise<todo | null>;
    create(data: Omit<todo, "id">): Promise<todo>;
    update(id: number, data: Partial<Omit<todo, "id">>): Promise<todo>;
    delete(id: number): Promise<void>;
    shareTodo(todoId: number, userId: number, canEdit: boolean, canDelete: boolean): Promise<{
        id: number;
        userId: number;
        todoId: number;
        createdAt: Date;
        canEdit: boolean;
        canDelete: boolean;
    }>;
    getTodoShare(todoId: number, userId: number): Promise<{
        id: number;
        userId: number;
        todoId: number;
        createdAt: Date;
        canEdit: boolean;
        canDelete: boolean;
    } | null>;
}
//# sourceMappingURL=todoRepository.d.ts.map