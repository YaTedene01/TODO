import type { Request, Response } from 'express';
export declare class AuthController {
    static login(req: Request, res: Response): Promise<void>;
    static refreshToken(req: Request, res: Response): Promise<void>;
    static logout(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=authController.d.ts.map