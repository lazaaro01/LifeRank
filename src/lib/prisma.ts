import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Each serverless function instance gets its own connection pool. With the
// pg driver's default of 10, concurrent Vercel invocations can quickly blow
// past Supabase's pooler connection limit, causing intermittent
// "too many clients" failures. Keep this pool small — Supabase's pgbouncer
// (transaction mode) is what actually does the pooling across instances.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  max: 3,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
