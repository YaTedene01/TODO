import { authRepository } from '../repositories/authRepository.js';
import type { LoginCredentials } from '../repositories/authRepository.js';

export class AuthService {
	static async login(credentials: LoginCredentials) {
		return await authRepository.login(credentials);
	}

	static async refreshToken(refreshToken: string) {
		return await authRepository.refreshToken(refreshToken);
	}

}
