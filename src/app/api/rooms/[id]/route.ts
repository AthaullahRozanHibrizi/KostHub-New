import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params { params: Promise<{ id: string }> }

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user.role !== "OWNER") {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    const room = await prisma.room.findUnique({ where: { id }, include: { kost: true } });
    if (!room || room.kost.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    const body = await req.json();
    const updated = await prisma.room.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description || null,
        price: parseFloat(body.price),
        priceYear: body.priceYear ? parseFloat(body.priceYear) : null,
        size: body.size || null,
        floor: body.floor ? parseInt(body.floor) : null,
        status: body.status || room.status,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Gagal mengupdate kamar" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user.role !== "OWNER") {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    const room = await prisma.room.findUnique({ where: { id }, include: { kost: true } });
    if (!room || room.kost.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    await prisma.room.delete({ where: { id } });
    return NextResponse.json({ message: "Kamar dihapus" });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus kamar" }, { status: 500 });
  }
}
