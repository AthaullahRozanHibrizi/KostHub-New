import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const bookings = await prisma.booking.findMany({
      where: { tenantId: session.user.id },
      include: {
        kost: { select: { id: true, name: true, city: true, images: true } },
        room: { select: { id: true, name: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json({ error: "Gagal memuat data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "TENANT") {
      return NextResponse.json({ error: "Hanya tenant yang bisa booking" }, { status: 403 });
    }

    const body = await req.json();
    const { kostId, roomId, startDate, endDate, duration, totalPrice, notes } = body;

    if (!kostId || !roomId || !startDate || !duration) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Check room availability
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room || room.status !== "AVAILABLE") {
      return NextResponse.json({ error: "Kamar tidak tersedia" }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        tenantId: session.user.id,
        kostId,
        roomId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        duration: parseInt(duration),
        totalPrice: parseFloat(totalPrice),
        notes: notes || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal membuat booking" }, { status: 500 });
  }
}
