import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Eye, MapPin, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Properti Saya" };

export default async function OwnerKostPage() {
  const session = await auth();
  if (!session || session.user.role !== "OWNER") redirect("/login");

  const kosts = await prisma.kost.findMany({
    where: { ownerId: session.user.id },
    include: {
      rooms: { select: { price: true, status: true } },
      _count: { select: { bookings: true, rooms: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Properti Saya</h1>
          <p className="text-gray-500 text-sm mt-1">{kosts.length} properti terdaftar</p>
        </div>
        <Link
          href="/dashboard/owner/kost/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40"
        >
          <Plus className="w-4 h-4" />
          Tambah Kost
        </Link>
      </div>

      {kosts.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl border border-white/8">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-violet-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-300 mb-2">Belum ada properti</h2>
          <p className="text-gray-500 text-sm mb-6">Mulai daftarkan kost pertama Anda sekarang.</p>
          <Link
            href="/dashboard/owner/kost/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-medium rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Tambah Kost Pertama
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {kosts.map((kost) => {
            const minPrice = kost.rooms.sort((a, b) => a.price - b.price)[0]?.price ?? 0;
            const available = kost.rooms.filter((r) => r.status === "AVAILABLE").length;
            return (
              <div key={kost.id} className="glass rounded-2xl border border-white/8 overflow-hidden hover:border-white/15 transition-all">
                {/* Image */}
                <div className="relative aspect-video bg-gray-800">
                  {kost.images[0] ? (
                    <Image src={kost.images[0]} alt={kost.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium backdrop-blur-sm ${
                      kost.isActive ? "bg-green-900/70 text-green-300" : "bg-gray-800/70 text-gray-400"
                    }`}>
                      {kost.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-white text-sm mb-1">{kost.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <MapPin className="w-3 h-3" /> {kost.city}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-sm font-bold text-gradient">{formatCurrency(minPrice)}</span>
                      <span className="text-xs text-gray-500">/bln</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" /> {available}/{kost._count.rooms} tersedia
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/kost/${kost.id}`}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all"
                    >
                      <Eye className="w-3 h-3" /> Lihat
                    </Link>
                    <Link
                      href={`/dashboard/owner/kost/${kost.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-violet-300 hover:text-violet-200 border border-violet-500/30 hover:border-violet-500/50 rounded-lg transition-all"
                    >
                      <Edit className="w-3 h-3" /> Edit
                    </Link>
                    <Link
                      href={`/dashboard/owner/kost/${kost.id}/rooms`}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-500/50 rounded-lg transition-all"
                    >
                      <Users className="w-3 h-3" /> Kamar
                    </Link>
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
