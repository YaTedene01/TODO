import { z } from "zod";
import { ErrorMessages } from "../utils/errorMessage.js";


export const historiqueSchema = z.object({
    action: z.string().min(2, ErrorMessages.HISTO_MISSING_FIELDS),
    userId: z.number().min(1, ErrorMessages.HISTO_MISSING_FIELDS),
    todoId: z.number().min(1, ErrorMessages.HISTO_MISSING_FIELDS),
    timestamp: z.string().min(2, ErrorMessages.HISTO_MISSING_FIELDS)
})

export type HistoriqueInput = z.infer<typeof historiqueSchema>;