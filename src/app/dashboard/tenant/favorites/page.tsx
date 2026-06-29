"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Star, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function TenantFavoritesPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((data) => setFavorites(data))
      .finally(() => setLoading(false));
  }, []);

  const removeFavorite = async (favoriteId: string) => {
    try {
      const res = await fetch(`/api/favorites/${favoriteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus favorit");
      setFavorites((f) => f.filter((fav) => fav.id !== favoriteId));
      toast.success("Dihapus dari favorit");
    } catch {
      toast.error("Gagal menghapus favorit");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Kost Favorit</h1>
        <p className="text-gray-500 text-sm mt-1">{favorites.length} kost disimpan</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-2xl border border-white/8 overflow-hidden animate-pulse">
              <div className="aspect-video bg-white/5" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="glass rounded-2xl border border-white/8 p-12 text-center">
          <Heart className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Belum ada kost favorit.</p>
          <Link href="/kost" className="text-sm text-violet-300 border border-violet-500/30 px-4 py-2 rounded-lg hover:bg-violet-500/10 transition-colors">
            Cari Kost Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((fav) => {
            const kost = fav.kost;
            const minPrice = kost.rooms[0]?.price ?? 0;
            return (
              <div key={fav.id} className="glass rounded-2xl border border-white/8 overflow-hidden group hover:border-white/15 transition-all">
                <div className="relative aspect-video overflow-hidden">
                  {kost.images[0] ? (
                    <Image src={kost.images[0]} alt={kost.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-800 to-cyan-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
                  <button
                    onClick={() => removeFavorite(fav.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 hover:bg-red-400 text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-violet-300 transition-colors">{kost.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <MapPin className="w-3 h-3 text-cyan-400" /> {kost.city}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gradient">{formatCurrency(minPrice)}/bln</span>
                    <Link href={`/kost/${kost.id}`} className="text-xs text-violet-300 hover:text-violet-200 border border-violet-500/30 px-2 py-1 rounded-lg">
                      Lihat →
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
