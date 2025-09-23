export interface LoginCredentials {
    email: string;
    password: string;
}
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    userId?: number;
    role?: string;
}
export declare class authRepository {
    static login(credentials: LoginCredentials): Promise<AuthResponse>;
    static refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
}
//# sourceMappingURL=authRepository.d.ts.map