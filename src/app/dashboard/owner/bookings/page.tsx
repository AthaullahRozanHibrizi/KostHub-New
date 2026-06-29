import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency, formatDate, BOOKING_STATUS_MAP } from "@/lib/utils";
import { Metadata } from "next";
import { BookingActions } from "@/components/dashboard/BookingActions";

export const metadata: Metadata = { title: "Booking Masuk" };

export default async function OwnerBookingsPage() {
  const session = await auth();
  if (!session || session.user.role !== "OWNER") redirect("/login");

  const bookings = await prisma.booking.findMany({
    where: { kost: { ownerId: session.user.id } },
    include: {
      tenant: { select: { name: true, email: true, phone: true } },
      kost: { select: { name: true } },
      room: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const pending = bookings.filter((b) => b.status === "PENDING").length;
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Booking Masuk</h1>
        <p className="text-gray-500 text-sm mt-1">
          {pending} menunggu konfirmasi · {confirmed} dikonfirmasi
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="glass rounded-2xl border border-white/8 p-12 text-center">
          <p className="text-gray-500">Belum ada booking masuk.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const status = BOOKING_STATUS_MAP[booking.status];
            return (
              <div key={booking.id} className="glass rounded-2xl border border-white/8 p-5 hover:border-white/15 transition-all">
                <div className="flex flex-wrap items-start gap-4">
                  {/* Tenant Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold shrink-0">
                      {booking.tenant.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{booking.tenant.name}</p>
                      <p className="text-xs text-gray-500">{booking.tenant.email}</p>
                      {booking.tenant.phone && (
                        <a href={`tel:${booking.tenant.phone}`} className="text-xs text-violet-300 hover:underline">
                          {booking.tenant.phone}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Properti</p>
                      <p className="text-white font-medium">{booking.kost.name}</p>
                      <p className="text-xs text-gray-500">{booking.room.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Mulai</p>
                      <p className="text-white">{formatDate(booking.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Durasi</p>
                      <p className="text-white">{booking.duration} bulan</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Total</p>
                      <p className="text-violet-300 font-bold">{formatCurrency(booking.totalPrice)}</p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium bg-${status.color}-500/10 text-${status.color}-300 border border-${status.color}-500/20`}>
                      {status.label}
                    </span>
                    <p className="text-xs text-gray-600">{formatDate(booking.createdAt)}</p>
                    {booking.status === "PENDING" && (
                      <BookingActions bookingId={booking.id} />
                    )}
                  </div>
                </div>

                {booking.notes && (
                  <div className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-400">
                    <span className="text-gray-600">Catatan: </span>{booking.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
