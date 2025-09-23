import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../auth/jwt.js';
import type { JwtPayload } from '../auth/jwt.js';
import { ErrorMessages } from "../utils/errorMessage.js";

const prisma = new PrismaClient();

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

export class authRepository {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Trouver l'utilisateur
    const userFound = await prisma.user.findUnique({
      where: { email },
    });

    if (!userFound) {
      throw new Error(ErrorMessages.AUTH_INVALID_CREDENTIALS);
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, userFound.password);
    if (!isPasswordValid) {
      throw new Error(ErrorMessages.AUTH_INVALID_CREDENTIALS);
    }

    // Préparer le payload JWT
    const payload: JwtPayload = {
      email: userFound.email,
      profil: userFound.role,
    };

    // Générer les tokens
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Retourner la réponse avec userId et role
    return { accessToken, refreshToken, userId: userFound.id, role: userFound.role };
  }    

  static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    // Vérifie et décode le refreshToken
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error(ErrorMessages.AUTH_REFRESH_TOKEN_INVALID);
    }
    const accessToken = generateAccessToken(payload);
    return { accessToken };
  }
}
