import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "OWNER") {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    const body = await req.json();
    const { kostId, name, description, price, priceYear, size, floor, status, facilities, images } = body;

    // Verify kost ownership
    const kost = await prisma.kost.findUnique({ where: { id: kostId } });
    if (!kost || kost.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    const room = await prisma.room.create({
      data: {
        kostId, name,
        description: description || null,
        price: parseFloat(price),
        priceYear: priceYear ? parseFloat(priceYear) : null,
        size: size || null,
        floor: floor ? parseInt(floor) : null,
        status: status || "AVAILABLE",
        facilities: facilities || [],
        images: images || [],
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal membuat kamar" }, { status: 500 });
  }
}
