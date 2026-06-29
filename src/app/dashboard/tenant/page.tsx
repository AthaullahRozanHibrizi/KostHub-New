import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BookOpen, Heart, Star, Home } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate, BOOKING_STATUS_MAP } from "@/lib/utils";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard Pencari" };

export default async function TenantDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== "TENANT") redirect("/login");

  const [bookings, favorites] = await Promise.all([
    prisma.booking.findMany({
      where: { tenantId: session.user.id },
      include: {
        kost: { select: { name: true, city: true, images: true } },
        room: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        kost: {
          include: {
            rooms: { select: { price: true }, orderBy: { price: "asc" }, take: 1 },
            _count: { select: { reviews: true } },
          },
        },
      },
      take: 4,
    }),
  ]);

  const activeBookings = bookings.filter((b) => b.status === "CONFIRMED").length;
  const totalSpent = bookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((s, b) => s + b.totalPrice, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard Pencari</h1>
        <p className="text-gray-500 text-sm mt-1">Selamat datang, {session.user.name}!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Booking" value={bookings.length} icon={BookOpen} color="violet" />
        <StatsCard title="Booking Aktif" value={activeBookings} icon={Home} color="green" />
        <StatsCard title="Kost Favorit" value={favorites.length} icon={Heart} color="cyan" />
        <StatsCard title="Total Pengeluaran" value={formatCurrency(totalSpent)} icon={Star} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="glass rounded-2xl border border-white/8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Booking Terbaru</h2>
            <Link href="/dashboard/tenant/bookings" className="text-xs text-violet-300">Lihat semua →</Link>
          </div>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">Belum ada booking.</p>
              <Link href="/kost" className="text-xs text-violet-300 mt-2 inline-block">Cari Kost →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => {
                const status = BOOKING_STATUS_MAP[booking.status];
                return (
                  <div key={booking.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-gray-800 overflow-hidden shrink-0">
                      {booking.kost.images[0] ? (
                        <Image src={booking.kost.images[0]} alt={booking.kost.name} width={48} height={48} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-800 to-cyan-800" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{booking.kost.name}</p>
                      <p className="text-xs text-gray-500">{booking.room.name} · {booking.duration} bln</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full bg-${status.color}-500/10 text-${status.color}-300`}>
                        {status.label}
                      </span>
                      <p className="text-xs text-gray-600 mt-1">{formatDate(booking.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Favorites */}
        <div className="glass rounded-2xl border border-white/8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Kost Favorit</h2>
            <Link href="/dashboard/tenant/favorites" className="text-xs text-violet-300">Lihat semua →</Link>
          </div>
          {favorites.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">Belum ada favorit.</p>
              <Link href="/kost" className="text-xs text-violet-300 mt-2 inline-block">Cari Kost →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map(({ id, kost }) => (
                <Link key={id} href={`/kost/${kost.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-violet-500/20 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-gray-800 overflow-hidden shrink-0">
                    {kost.images[0] ? (
                      <Image src={kost.images[0]} alt={kost.name} width={48} height={48} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-violet-800 to-cyan-800" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors truncate">{kost.name}</p>
                    <p className="text-xs text-gray-500">{kost.city}</p>
                  </div>
                  <p className="text-xs font-bold text-gradient shrink-0">
                    {formatCurrency(kost.rooms[0]?.price ?? 0)}/bln
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
