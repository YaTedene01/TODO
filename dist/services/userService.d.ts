export declare class UserService {
    private mnrepo;
    constructor();
    getAllUsers(): Promise<({
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
    findUserById(id: number): Promise<({
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
    createUser(data: any): Promise<{
        id: number;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        imageUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
    updateUser(id: number, data: any): Promise<{
        id: number;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        imageUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
    deleteUser(id: number): Promise<void>;
}
//# sourceMappingURL=userService.d.ts.map