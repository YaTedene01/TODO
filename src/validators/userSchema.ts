import { z } from  "zod";
import { ErrorMessages } from "../utils/errorMessage.js";

export const CreateUserSchema = z.object({
    email: z.string().email().min(2, ErrorMessages.AUTH_MISSING_EMAIL),
    password: z.string().min(2, ErrorMessages.AUTH_MISSING_PASSWORD),
    name: z.string().min(2, ErrorMessages.USER_MISSING_NAME),
    role: z.enum(["USER", "ADMIN"], { error: ErrorMessages.USER_MISSING_ROLE }),
    imageUrl: z.string().optional()
})
export const UpdateUserSchema = CreateUserSchema.partial();
