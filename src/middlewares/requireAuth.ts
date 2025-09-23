import { verifyAccessToken } from '../auth/jwt.js';
import type { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { HttpStatus } from '../utils/httpStatus.js';
import { ErrorMessages } from '../utils/errorMessage.js';
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    profil?: string;
  };
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ error: ErrorMessages.UNAUTHORIZED });
  }
  const token = authHeader.split(' ')[1] as string;
  try {
    const payload = verifyAccessToken(token);
    const prisma = new PrismaClient();
    const userFound = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!userFound) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: ErrorMessages.UNAUTHORIZED });
    }
    req.user = {
      id: userFound.id,
      email: userFound.email,
      profil: userFound.role,
    };
    next();
  } catch (err) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ error: ErrorMessages.UNAUTHORIZED });
  }
};
