import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { KostCard } from "@/components/kost/KostCard";
import { prisma } from "@/lib/prisma";

async function getPopularKosts() {
  try {
    const kosts = await prisma.kost.findMany({
      where: { isActive: true },
      include: {
        owner: { select: { name: true, avatar: true } },
        rooms: { select: { price: true }, orderBy: { price: "asc" }, take: 1 },
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true, rooms: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    return kosts.map((kost) => ({
      ...kost,
      minPrice: kost.rooms[0]?.price ?? 0,
      avgRating:
        kost.reviews.length > 0
          ? kost.reviews.reduce((sum, r) => sum + r.rating, 0) / kost.reviews.length
          : 0,
    }));
  } catch {
    return [];
  }
}

export async function PopularKost() {
  const kosts = await getPopularKosts();

  if (kosts.length === 0) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center text-gray-500 py-12">
          <p>Belum ada kost yang tersedia. Jadilah yang pertama mendaftarkan kost Anda!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-violet-400" />
            <span className="text-sm font-medium text-violet-400 uppercase tracking-widest">
              Populer
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Kost <span className="text-gradient">Terpopuler</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Pilihan kost terbaik yang paling banyak diminati
          </p>
        </div>
        <Link
          href="/kost"
          className="hidden sm:flex items-center gap-2 text-sm text-violet-300 hover:text-violet-200 transition-colors group"
        >
          Lihat semua
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {kosts.map((kost) => (
          <KostCard key={kost.id} kost={kost as any} />
        ))}
      </div>

      {/* Mobile see all */}
      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/kost"
          className="inline-flex items-center gap-2 text-sm text-violet-300 hover:text-violet-200 border border-violet-500/30 px-4 py-2 rounded-lg"
        >
          Lihat Semua Kost
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
