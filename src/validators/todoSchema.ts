import { z } from "zod";
import { ErrorMessages } from "../utils/errorMessage.js";

export const CreateTodoSchema = z.object({
    title: z.string().min(1, ErrorMessages.TODO_MISSING_TITLE),
    description: z.string().optional(),
    completed: z.boolean().optional().refine((val) => val !== undefined, {
        message: ErrorMessages.TODO_MISSING_COMPLETED
    }),
    endTime: z.string().optional()
});