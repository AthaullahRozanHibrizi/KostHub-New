import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params { params: Promise<{ id: string }> }

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const favorite = await prisma.favorite.findUnique({ where: { id } });
    if (!favorite || favorite.userId !== session.user.id) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    await prisma.favorite.delete({ where: { id } });
    return NextResponse.json({ message: "Favorit dihapus" });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus favorit" }, { status: 500 });
  }
}
