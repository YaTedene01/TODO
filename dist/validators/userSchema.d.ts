import { z } from "zod";
export declare const CreateUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    role: z.ZodEnum<{
        USER: "USER";
        ADMIN: "ADMIN";
    }>;
    imageUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateUserSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        USER: "USER";
        ADMIN: "ADMIN";
    }>>;
    imageUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
//# sourceMappingURL=userSchema.d.ts.map