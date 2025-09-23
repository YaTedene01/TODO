import { z } from 'zod';
import { ErrorMessages } from '../utils/errorMessage.js';
import { HttpStatus } from '../utils/httpStatus.js';

export const loginSchema = z.object({
  email: z.email('Email invalide'),
  password: z.string().min(1, ErrorMessages.AUTH_MISSING_PASSWORD),
});

export type LoginInput = z.infer<typeof loginSchema>;
