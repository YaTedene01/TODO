import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
// Prisma lira DATABASE_URL depuis process.env
export const mnprisma = new PrismaClient();
//# sourceMappingURL=db.js.map