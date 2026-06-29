import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params { params: Promise<{ id: string }> }

// GET single kost
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const kost = await prisma.kost.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, phone: true, avatar: true } },
        rooms: { orderBy: { price: "asc" } },
        reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
        _count: { select: { reviews: true } },
      },
    });
    if (!kost) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
    return NextResponse.json(kost);
  } catch {
    return NextResponse.json({ error: "Gagal memuat data" }, { status: 500 });
  }
}

// PUT update kost
export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const kost = await prisma.kost.findUnique({ where: { id } });
    if (!kost || kost.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    const body = await req.json();
    const updated = await prisma.kost.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        address: body.address,
        district: body.district,
        city: body.city,
        province: body.province,
        type: body.type,
        latitude: body.latitude,
        longitude: body.longitude,
        facilities: body.facilities || [],
        rules: body.rules || [],
        images: body.images || [],
        isActive: body.isActive ?? kost.isActive,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Gagal mengupdate" }, { status: 500 });
  }
}

// DELETE kost
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const kost = await prisma.kost.findUnique({ where: { id } });
    if (!kost || kost.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    await prisma.kost.delete({ where: { id } });
    return NextResponse.json({ message: "Kost dihapus" });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus" }, { status: 500 });
  }
}
