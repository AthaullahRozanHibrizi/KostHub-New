import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma Client — Aman untuk Vercel Serverless + Supabase
 *
 * FILE INI  : src/lib/prisma.ts  (Prisma CLIENT — untuk query database)
 * BUKAN INI : prisma.config.ts   (Prisma CONFIG — untuk CLI migrate/push)
 *
 * Strategi koneksi:
 * - Production (Vercel): DATABASE_URL (pooled via Supavisor port 6543)
 * - Development (lokal): DIRECT_URL (direct port 5432, lebih stabil)
 *
 * globalThis pattern mencegah multiple instance saat Next.js hot-reload.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString =
    process.env.NODE_ENV === "production"
      ? process.env.DATABASE_URL!
      : (process.env.DIRECT_URL ?? process.env.DATABASE_URL!);

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
