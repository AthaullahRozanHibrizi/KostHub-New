import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Home, BookOpen, Star, DollarSign, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate, BOOKING_STATUS_MAP } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard Pemilik" };

export default async function OwnerDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== "OWNER") redirect("/login");

  const userId = session.user.id;

  const [kosts, bookings] = await Promise.all([
    prisma.kost.findMany({
      where: { ownerId: userId },
      include: {
        rooms: { select: { price: true, status: true } },
        _count: { select: { bookings: true } },
      },
    }),
    prisma.booking.findMany({
      where: { kost: { ownerId: userId } },
      include: {
        tenant: { select: { name: true } },
        kost: { select: { name: true } },
        room: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const totalRevenue = bookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((s, b) => s + b.totalPrice, 0);

  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  const totalRooms = kosts.reduce((s, k) => s + k.rooms.length, 0);
  const occupiedRooms = kosts.reduce(
    (s, k) => s + k.rooms.filter((r) => r.status === "OCCUPIED").length,
    0
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Pemilik</h1>
          <p className="text-gray-500 text-sm mt-1">Selamat datang, {session.user.name}!</p>
        </div>
        <Link
          href="/dashboard/owner/kost/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-violet-500/20"
        >
          <Plus className="w-4 h-4" />
          Tambah Kost
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Properti" value={kosts.length} icon={Home} color="violet" />
        <StatsCard title="Booking Pending" value={pendingBookings} icon={BookOpen} color="yellow" />
        <StatsCard
          title="Hunian"
          value={`${occupiedRooms}/${totalRooms}`}
          subtitle="kamar terisi"
          icon={Star}
          color="cyan"
        />
        <StatsCard
          title="Total Pendapatan"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="glass rounded-2xl border border-white/8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Booking Terbaru</h2>
            <Link href="/dashboard/owner/bookings" className="text-xs text-violet-300 hover:text-violet-200 flex items-center gap-1">
              Lihat semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">Belum ada booking masuk.</p>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => {
                const status = BOOKING_STATUS_MAP[booking.status];
                return (
                  <div key={booking.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold shrink-0">
                      {booking.tenant.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{booking.tenant.name}</p>
                      <p className="text-xs text-gray-500 truncate">{booking.kost.name} · {booking.room.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-${status.color}-500/10 text-${status.color}-300`}>
                        {status.label}
                      </span>
                      <p className="text-xs text-gray-600 mt-0.5">{formatDate(booking.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* My Kosts */}
        <div className="glass rounded-2xl border border-white/8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Properti Saya</h2>
            <Link href="/dashboard/owner/kost" className="text-xs text-violet-300 hover:text-violet-200 flex items-center gap-1">
              Kelola <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {kosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm mb-3">Belum ada properti.</p>
              <Link href="/dashboard/owner/kost/new" className="text-xs text-violet-300 hover:text-violet-200 border border-violet-500/30 px-3 py-1.5 rounded-lg">
                + Tambah Kost Pertama
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {kosts.map((kost) => {
                const available = kost.rooms.filter((r) => r.status === "AVAILABLE").length;
                return (
                  <Link
                    key={kost.id}
                    href={`/dashboard/owner/kost/${kost.id}/edit`}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5 hover:border-violet-500/20 transition-all group"
                  >
                    <div>
                      <p className="text-sm text-white font-medium group-hover:text-violet-300 transition-colors">{kost.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{available} kamar tersedia</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${kost.isActive ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}>
                      {kost.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
