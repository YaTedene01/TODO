import { HistoriqueService } from "../services/historiqueService.js";
import { ErrorMessages } from "../utils/errorMessage.js";
import { HttpStatus } from "../utils/httpStatus.js";
import { TodoService } from "../services/todoService.js";
import { CreateTodoSchema } from "../validators/todoSchema.js";
const mnservice = new TodoService();
const historiqueService = new HistoriqueService();
export class todoController {
    static async share(req, res) {
        try {
            const todoId = Number(req.params.id);
            const { userId, canEdit, canDelete } = req.body;
            if (!userId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: ErrorMessages.TODO_USERID_REQUIRED });
            }
            const todo = await mnservice.findTodoById(todoId);
            if (!todo) {
                return res.status(HttpStatus.NOT_FOUND).json({ error: ErrorMessages.TODO_NOT_FOUND });
            }
            // Seul le propriétaire peut partager
            if (todo.userId !== req.user?.id) {
                return res.status(HttpStatus.FORBIDDEN).json({ error: ErrorMessages.TODO_OWNER_ONLY_SHARE });
            }
            const share = await mnservice.shareTodo(todoId, userId, !!canEdit, !!canDelete);
            await historiqueService.create({
                userId: req.user?.id,
                action: "SHARE",
                todoId: todoId,
                timestamp: new Date()
            });
            res.status(HttpStatus.CREATED).json(share);
        }
        catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }
    static async complete(req, res) {
        try {
            const id = Number(req.params.id);
            const existing = await mnservice.findTodoById(id);
            if (!existing) {
                return res.status(HttpStatus.NOT_FOUND).json({ error: ErrorMessages.TODO_NOT_FOUND });
            }
            const todo = await mnservice.updateTodo(id, { completed: true });
            await historiqueService.create({
                userId: todo.userId,
                action: "UPDATE",
                todoId: id,
                timestamp: new Date()
            });
            res.json(todo);
        }
        catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }
    static async getAll(_req, res) {
        try {
            const mnusers = await mnservice.getAllTodos();
            res.json(mnusers);
        }
        catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.SERVER_ERROR });
        }
    }
    static async findById(req, res) {
        try {
            const id = Number(req.params.id);
            const mntodo = await mnservice.findTodoById(id);
            if (!mntodo) {
                return res.status(HttpStatus.NOT_FOUND).json({ error: ErrorMessages.TODO_NOT_FOUND });
            }
            return res.json(mntodo);
        }
        catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }
    static async create(req, res) {
        try {
            const mndata = CreateTodoSchema.parse(req.body);
            // Injecte le userId du token dans la création
            const todoData = { ...mndata, userId: req.user?.id };
            const mntodo = await mnservice.createTodo(todoData);
            await historiqueService.create({
                userId: mntodo.userId,
                action: "CREATE",
                todoId: mntodo.id,
                timestamp: new Date()
            });
            res.status(HttpStatus.CREATED).json(mntodo);
        }
        catch (error) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json({ errors });
        }
    }
    static async update(req, res) {
        try {
            const id = Number(req.params.id);
            const mndata = CreateTodoSchema.parse(req.body);
            // Injecte le userId du token dans la modification
            const todoData = { ...mndata, userId: req.user?.id };
            const mntodo = await mnservice.updateTodo(id, todoData);
            await historiqueService.create({
                userId: mntodo.userId,
                action: "UPDATE",
                todoId: mntodo.id,
                timestamp: new Date()
            });
            res.json(mntodo);
        }
        catch (error) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json({ errors });
        }
    }
    static async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await historiqueService.create({
                userId: typeof req.user?.id === 'number' ? req.user.id : -1,
                action: "DELETE",
                todoId: id,
                timestamp: new Date()
            });
            await mnservice.deleteTodo(id);
            res.status(HttpStatus.NO_CONTENT).send();
        }
        catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }
}
//# sourceMappingURL=todoController.js.map