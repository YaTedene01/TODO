import { AuthService } from '../services/authService.js';
import { ErrorMessages } from "../utils/errorMessage.js";
import { HttpStatus } from "../utils/httpStatus.js";
export class AuthController {
    static async login(req, res) {
        try {
            const credentials = req.body;
            const tokens = await AuthService.login(credentials);
            res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 });
            // Retourne accessToken, userId et role
            res.status(HttpStatus.OK).json({
                accessToken: tokens.accessToken,
                userId: tokens.userId,
                role: tokens.role
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            res.status(HttpStatus.UNAUTHORIZED).json({ error: ErrorMessages.AUTH_INVALID_CREDENTIALS });
        }
    }
    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            const token = await AuthService.refreshToken(refreshToken);
            res.status(HttpStatus.OK).json(token);
        }
        catch (error) {
            res.status(HttpStatus.UNAUTHORIZED).json({ error: ErrorMessages.AUTH_REFRESH_TOKEN_INVALID });
        }
    }
    static async logout(_req, res) {
        res.status(HttpStatus.OK).json({ message: ErrorMessages.AUTH_LOGOUT_SUCCESS });
    }
}
//# sourceMappingURL=authController.js.map