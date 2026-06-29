import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency, formatDate, BOOKING_STATUS_MAP } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Riwayat Booking" };

export default async function TenantBookingsPage() {
  const session = await auth();
  if (!session || session.user.role !== "TENANT") redirect("/login");

  const bookings = await prisma.booking.findMany({
    where: { tenantId: session.user.id },
    include: {
      kost: { select: { id: true, name: true, city: true, images: true } },
      room: { select: { name: true, price: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Riwayat Booking</h1>
        <p className="text-gray-500 text-sm mt-1">{bookings.length} total booking</p>
      </div>

      {bookings.length === 0 ? (
        <div className="glass rounded-2xl border border-white/8 p-12 text-center">
          <p className="text-gray-500 mb-4">Belum ada riwayat booking.</p>
          <Link href="/kost" className="text-sm text-violet-300 border border-violet-500/30 px-4 py-2 rounded-lg hover:bg-violet-500/10 transition-colors">
            Mulai Cari Kost
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const status = BOOKING_STATUS_MAP[booking.status];
            const colorMap: Record<string, string> = {
              yellow: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
              green: "bg-green-500/10 text-green-300 border-green-500/20",
              red: "bg-red-500/10 text-red-300 border-red-500/20",
              gray: "bg-gray-500/10 text-gray-400 border-gray-500/20",
              blue: "bg-blue-500/10 text-blue-300 border-blue-500/20",
            };
            return (
              <div key={booking.id} className="glass rounded-2xl border border-white/8 overflow-hidden hover:border-white/15 transition-all">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-32 h-24 sm:h-auto relative shrink-0 bg-gray-800">
                    {booking.kost.images[0] ? (
                      <Image src={booking.kost.images[0]} alt={booking.kost.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-violet-800 to-cyan-800" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-white">{booking.kost.name}</h3>
                          <Link href={`/kost/${booking.kost.id}`} className="text-gray-500 hover:text-violet-300 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <p className="text-sm text-gray-500">{booking.room.name} · {booking.kost.city}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${colorMap[status.color]}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Tanggal Mulai</p>
                        <p className="text-sm text-white">{formatDate(booking.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Durasi</p>
                        <p className="text-sm text-white">{booking.duration} bulan</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Total</p>
                        <p className="text-sm font-bold text-gradient">{formatCurrency(booking.totalPrice)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Dipesan {formatDate(booking.createdAt)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
