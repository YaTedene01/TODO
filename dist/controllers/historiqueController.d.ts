import type { Request, Response } from "express";
export declare class HistoriqueController {
    static getAll(req: Request, res: Response): Promise<void>;
    static create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static delete(req: Request, res: Response): Promise<void>;
    static update(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=historiqueController.d.ts.map