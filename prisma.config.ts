import { config } from "dotenv";
import { defineConfig } from "@prisma/config";

// Next.js menggunakan .env.local untuk override lokal
// dotenv/config default hanya membaca .env
// Kita load .env.local secara eksplisit agar prisma CLI bisa membacanya
config({ path: ".env.local" });

/**
 * Prisma 7 Config — Supabase + Vercel Serverless
 *
 * DATABASE_URL  → Supabase Connection Pooling URL (Supavisor, port 6543)
 *                 Digunakan Prisma Client saat runtime query di Vercel
 *                 Tambahkan: ?pgbouncer=true di akhir URL
 *
 * DIRECT_URL    → Supabase Direct Connection URL (port 5432)
 *                 Digunakan `prisma db push` / `prisma migrate` saja
 */
export default defineConfig({
  datasource: {
    // Kembalikan ke DATABASE_URL agar aman saat aplikasi berjalan di mode serverless
    url: process.env.DATABASE_URL,
    // @ts-ignore - Prisma 7 config types might not include directUrl yet, but CLI needs it
    directUrl: process.env.DIRECT_URL,
  },
})
