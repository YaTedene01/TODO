import type { LoginCredentials } from '../repositories/authRepository.js';
export declare class AuthService {
    static login(credentials: LoginCredentials): Promise<import("../repositories/authRepository.js").AuthResponse>;
    static refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
}
//# sourceMappingURL=authService.d.ts.map