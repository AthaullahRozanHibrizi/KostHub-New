import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { KostCard } from "@/components/kost/KostCard";
import { SearchBar } from "@/components/landing/SearchBar";
import { Filter, Grid, List } from "lucide-react";
import { Metadata } from "next";
import { KostType } from "@/types";

export const metadata: Metadata = {
  title: "Cari Kost",
  description: "Temukan kost terbaik berdasarkan lokasi, harga, dan fasilitas.",
};

interface SearchParams {
  q?: string;
  city?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
}

async function getKosts(params: SearchParams) {
  const where: any = { isActive: true };

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { address: { contains: params.q, mode: "insensitive" } },
      { district: { contains: params.q, mode: "insensitive" } },
    ];
  }

  if (params.city) where.city = { equals: params.city, mode: "insensitive" };
  if (params.type) where.type = params.type as KostType;

  const kosts = await prisma.kost.findMany({
    where,
    include: {
      rooms: { select: { price: true }, orderBy: { price: "asc" }, take: 1 },
      reviews: { select: { rating: true } },
      _count: { select: { reviews: true, rooms: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 24,
  });

  return kosts
    .map((k) => ({
      ...k,
      minPrice: k.rooms[0]?.price ?? 0,
      avgRating:
        k.reviews.length > 0
          ? k.reviews.reduce((s, r) => s + r.rating, 0) / k.reviews.length
          : 0,
    }))
    .filter((k) => {
      if (params.minPrice && k.minPrice < Number(params.minPrice)) return false;
      if (params.maxPrice && k.minPrice > Number(params.maxPrice)) return false;
      return true;
    });
}

export default async function KostListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const kosts = await getKosts(params);

  return (
    <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto">
      {/* Search bar sticky */}
      <div className="mb-8">
        <SearchBar />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">
            {params.city ? `Kost di ${params.city}` : "Semua Kost"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {kosts.length} properti ditemukan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg glass border border-white/10 text-gray-400 hover:text-white transition-colors">
            <Grid className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg glass border border-white/10 text-gray-400 hover:text-white transition-colors">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results */}
      {kosts.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-400 mb-2">Kost tidak ditemukan</h2>
          <p className="text-gray-600 text-sm">Coba ubah filter pencarian Anda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {kosts.map((kost) => (
            <KostCard key={kost.id} kost={kost as any} />
          ))}
        </div>
      )}
    </div>
  );
}
