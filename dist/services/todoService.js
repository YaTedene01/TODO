import { TodoRepository } from "../repositories/todoRepository.js";
// Utilisation de l'inférence TypeScript pour le type Todo
export class TodoService {
    mnrepo;
    constructor() {
        this.mnrepo = new TodoRepository();
    }
    getAllTodos() {
        return this.mnrepo.findAll();
    }
    findTodoById(id) {
        return this.mnrepo.findById(id);
    }
    createTodo(data) {
        return this.mnrepo.create(data);
    }
    updateTodo(id, data) {
        return this.mnrepo.update(id, data);
    }
    async deleteTodo(id) {
        await this.mnrepo.delete(id);
    }
    async shareTodo(todoId, userId, canEdit, canDelete) {
        return this.mnrepo.shareTodo(todoId, userId, canEdit, canDelete);
    }
    async canEditOrDelete(todoId, userId) {
        const share = await this.mnrepo.getTodoShare(todoId, userId);
        return {
            canEdit: !!share?.canEdit,
            canDelete: !!share?.canDelete
        };
    }
}
//# sourceMappingURL=todoService.js.map