import  { TodoRepository } from "../repositories/todoRepository.js";
// Utilisation de l'inférence TypeScript pour le type Todo

export class TodoService {
    private mnrepo: TodoRepository;

    constructor() {
        this.mnrepo = new TodoRepository();
    }


    getAllTodos() {
        return this.mnrepo.findAll();
    }

    findTodoById(id: number) {
        return this.mnrepo.findById(id);
    }

    createTodo(data: any) {
        return this.mnrepo.create(data);
    }

    updateTodo(id: number, data: any) {
        return this.mnrepo.update(id, data);
    }

    async deleteTodo(id: number): Promise<void> {
        await this.mnrepo.delete(id);
    }

    async shareTodo(todoId: number, userId: number, canEdit: boolean, canDelete: boolean) {
        return this.mnrepo.shareTodo(todoId, userId, canEdit, canDelete);
    }

    async canEditOrDelete(todoId: number, userId: number): Promise<{ canEdit: boolean, canDelete: boolean }> {
        const share = await this.mnrepo.getTodoShare(todoId, userId);
        return {
            canEdit: !!share?.canEdit,
            canDelete: !!share?.canDelete
        };
    }

}