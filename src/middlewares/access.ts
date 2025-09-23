import { TodoRepository } from "../repositories/todoRepository.js";

import type { Request, Response, NextFunction } from "express";
import { ErrorMessages } from "../utils/errorMessage.js";
import { HttpStatus } from "../utils/httpStatus.js";

// Typage local pour inclure la propriété user sur Request
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}
// Middleware spécifique pour la ressource "todos"
// - GET: tout utilisateur connecté peut lister toutes les tâches
// - PUT/PATCH/DELETE: l'utilisateur ne peut modifier/supprimer que ses propres tâches
export const todoAccess = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.method === "GET") {
    return next();
  }

  // Pour modification/suppression, vérifier que la tâche appartient à l'utilisateur
  const todoId = req.params.id;
  const userId = req.user?.id;
  if (!todoId || !userId) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: ErrorMessages.BAD_REQUEST });
  }
  

  try {
  const todoRepo = new TodoRepository();
  const todo = await todoRepo.findById(Number(todoId));
    if (!todo) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: ErrorMessages.TODO_NOT_FOUND });
    }
    if (todo.userId === Number(userId)) {
      return next();
    }
    // Vérifier les droits de partage
    const share = await todoRepo.getTodoShare(Number(todoId), Number(userId));
    if (share && ((req.method === "PUT" && share.canEdit) || (req.method === "DELETE" && share.canDelete))) {
      return next();
    }
    return res.status(HttpStatus.FORBIDDEN).json({ error: ErrorMessages.FORBIDDEN });
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.SERVER_ERROR });
  }
};