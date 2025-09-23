import type { InterfaceRepository } from "./InterfacRepository.js";
export declare class UserRepository implements InterfaceRepository<any> {
    findAll(): Promise<({
        todos: {
            id: number;
            userId: number;
            title: string;
            completed: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: number;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        imageUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
    })[]>;
    findById(id: number): Promise<({
        todos: {
            id: number;
            userId: number;
            title: string;
            completed: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: number;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        imageUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
    }) | null>;
    create(data: any): Promise<{
        id: number;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        imageUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        imageUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
    delete(id: number): Promise<void>;
    getSharedTodos(userId: number): Promise<({
        user: {
            id: number;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            imageUrl: string | null;
            role: import("@prisma/client").$Enums.Role;
        };
        shares: {
            id: number;
            userId: number;
            todoId: number;
            createdAt: Date;
            canEdit: boolean;
            canDelete: boolean;
        }[];
    } & {
        id: number;
        userId: number;
        title: string;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
//# sourceMappingURL=userRepository.d.ts.map