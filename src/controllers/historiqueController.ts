import type { Request, Response } from "express";
import { HistoriqueService } from "../services/historiqueService.js";
import { ErrorMessages } from "../utils/errorMessage.js";
import { HttpStatus } from "../utils/httpStatus.js";
const historiqueService = new HistoriqueService();

export class HistoriqueController {
    static async getAll(req: Request, res: Response) {
        try {
            const historiques = await historiqueService.findAll();
            res.json(historiques);
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.SERVER_ERROR });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { userId, action, todoId, timestamp } = req.body;
            if (!userId || !action || !todoId || !timestamp) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: ErrorMessages.HISTO_MISSING_FIELDS });
            }
            const newHistorique = await historiqueService.create({
                userId,
                action,
                todoId,
                timestamp: new Date(timestamp),
            });
            res.status(HttpStatus.CREATED).json(newHistorique);
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }
    static async delete(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const deleted = await historiqueService.delete(id);
            res.status(HttpStatus.NO_CONTENT).json(deleted);
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }
    static async update(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const { userId, action, todoId, timestamp } = req.body;
            const updated = await historiqueService.update(id, { userId, action, todoId, timestamp });
            res.status(HttpStatus.OK).json(updated);
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }
}
