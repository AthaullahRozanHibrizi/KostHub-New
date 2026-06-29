import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all favorites
export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        kost: {
          include: {
            rooms: { select: { price: true }, orderBy: { price: "asc" }, take: 1 },
            _count: { select: { reviews: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites);
  } catch {
    return NextResponse.json({ error: "Gagal memuat favorit" }, { status: 500 });
  }
}

// POST toggle favorite
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { kostId } = await req.json();
    if (!kostId) return NextResponse.json({ error: "kostId diperlukan" }, { status: 400 });

    const existing = await prisma.favorite.findUnique({
      where: { userId_kostId: { userId: session.user.id, kostId } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ favorited: false });
    } else {
      await prisma.favorite.create({ data: { userId: session.user.id, kostId } });
      return NextResponse.json({ favorited: true });
    }
  } catch {
    return NextResponse.json({ error: "Gagal toggle favorit" }, { status: 500 });
  }
}
