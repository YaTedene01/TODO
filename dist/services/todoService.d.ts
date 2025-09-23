export declare class TodoService {
    private mnrepo;
    constructor();
    getAllTodos(): Promise<{
        id: number;
        userId: number;
        title: string;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findTodoById(id: number): Promise<{
        id: number;
        userId: number;
        title: string;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    createTodo(data: any): Promise<{
        id: number;
        userId: number;
        title: string;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateTodo(id: number, data: any): Promise<{
        id: number;
        userId: number;
        title: string;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteTodo(id: number): Promise<void>;
    shareTodo(todoId: number, userId: number, canEdit: boolean, canDelete: boolean): Promise<{
        id: number;
        userId: number;
        todoId: number;
        createdAt: Date;
        canEdit: boolean;
        canDelete: boolean;
    }>;
    canEditOrDelete(todoId: number, userId: number): Promise<{
        canEdit: boolean;
        canDelete: boolean;
    }>;
}
//# sourceMappingURL=todoService.d.ts.map