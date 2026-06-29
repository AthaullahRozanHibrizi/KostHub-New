import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware — Edge Runtime Compatible
 *
 * JANGAN import auth dari @/lib/auth di sini!
 * auth.ts → prisma.ts → @prisma/adapter-pg → pg → Node.js built-ins
 * Node.js built-ins TIDAK berjalan di Edge Runtime (middleware).
 *
 * Solusi: gunakan getToken() dari next-auth/jwt.
 * Ini hanya membaca & memverifikasi JWT cookie — tanpa menyentuh database,
 * sehingga aman dijalankan di Edge Runtime.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Baca JWT dari cookie — tidak menyentuh database
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const isOwner  = token?.role === "OWNER";
  const isTenant = token?.role === "TENANT";

  // Proteksi route Owner Dashboard
  if (pathname.startsWith("/dashboard/owner")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (!isOwner) {
      return NextResponse.redirect(new URL("/dashboard/tenant", req.url));
    }
  }

  // Proteksi route Tenant Dashboard
  if (pathname.startsWith("/dashboard/tenant")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (!isTenant) {
      return NextResponse.redirect(new URL("/dashboard/owner", req.url));
    }
  }

  // Redirect pengguna yang sudah login dari halaman auth
  if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
    if (isOwner) {
      return NextResponse.redirect(new URL("/dashboard/owner", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard/tenant", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Jalankan middleware hanya di halaman — skip API, _next, dan static files
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico).*)"],
};
