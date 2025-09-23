import { authRepository } from '../repositories/authRepository.js';
export class AuthService {
    static async login(credentials) {
        return await authRepository.login(credentials);
    }
    static async refreshToken(refreshToken) {
        return await authRepository.refreshToken(refreshToken);
    }
}
//# sourceMappingURL=authService.js.map