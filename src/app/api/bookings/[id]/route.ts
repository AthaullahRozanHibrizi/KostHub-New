import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params { params: Promise<{ id: string }> }

// PATCH update booking status (owner only)
export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { kost: true, room: true },
    });

    if (!booking) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

    // Only owner can confirm/reject, tenant can cancel
    const isOwner = session.user.role === "OWNER" && booking.kost.ownerId === session.user.id;
    const isTenant = session.user.role === "TENANT" && booking.tenantId === session.user.id;

    if (!isOwner && !isTenant) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    const { status } = await req.json();

    // Validate allowed transitions
    const allowedForOwner = ["CONFIRMED", "REJECTED", "COMPLETED"];
    const allowedForTenant = ["CANCELLED"];

    if (isOwner && !allowedForOwner.includes(status)) {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }
    if (isTenant && !allowedForTenant.includes(status)) {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    // Update room status if confirmed
    if (status === "CONFIRMED") {
      await prisma.room.update({ where: { id: booking.roomId }, data: { status: "OCCUPIED" } });
    } else if (status === "CANCELLED" || status === "REJECTED") {
      await prisma.room.update({ where: { id: booking.roomId }, data: { status: "AVAILABLE" } });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Gagal mengupdate status" }, { status: 500 });
  }
}
