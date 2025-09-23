import type { Request, Response } from "express";
interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
    };
}
export declare class todoController {
    static share(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static complete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getAll(_req: Request, res: Response): Promise<void>;
    static findById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static create(req: AuthenticatedRequest, res: Response): Promise<void>;
    static update(req: AuthenticatedRequest, res: Response): Promise<void>;
    static delete(req: AuthenticatedRequest, res: Response): Promise<void>;
}
export {};
//# sourceMappingURL=todoController.d.ts.map