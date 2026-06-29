import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all kosts (with filters)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const type = searchParams.get("type");
    const q = searchParams.get("q");

    const where: any = { isActive: true };
    if (city) where.city = { contains: city, mode: "insensitive" };
    if (type) where.type = type;
    if (q) where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
    ];

    const kosts = await prisma.kost.findMany({
      where,
      include: {
        rooms: { select: { price: true }, orderBy: { price: "asc" }, take: 1 },
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(kosts);
  } catch {
    return NextResponse.json({ error: "Gagal memuat data" }, { status: 500 });
  }
}

// POST create kost (owner only)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "OWNER") {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, address, district, city, province, type, latitude, longitude, facilities, rules, images } = body;

    if (!name || !description || !address || !city) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const kost = await prisma.kost.create({
      data: {
        name, description, address, district, city, province,
        type: type || "CAMPUR",
        latitude, longitude,
        facilities: facilities || [],
        rules: rules || [],
        images: images || [],
        ownerId: session.user.id,
      },
    });

    return NextResponse.json(kost, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal membuat kost" }, { status: 500 });
  }
}
