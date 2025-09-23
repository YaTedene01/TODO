import { z } from "zod";
export declare const historiqueSchema: z.ZodObject<{
    action: z.ZodString;
    userId: z.ZodNumber;
    todoId: z.ZodNumber;
    timestamp: z.ZodString;
}, z.core.$strip>;
export type HistoriqueInput = z.infer<typeof historiqueSchema>;
//# sourceMappingURL=historiqueSchema.d.ts.map