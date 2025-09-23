import { z } from "zod";
export declare const CreateTodoSchema: z.ZodObject<{
    title: z.ZodString;
    completed: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=todoSchema.d.ts.map