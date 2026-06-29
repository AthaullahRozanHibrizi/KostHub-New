"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, DollarSign, SlidersHorizontal } from "lucide-react";
import { INDONESIAN_CITIES, KOST_TYPES } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/kost?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "w-full glass rounded-2xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden",
        className
      )}
    >
      {/* Main search row */}
      <div className="flex items-center gap-0">
        <div className="flex-1 flex items-center gap-3 px-5 py-4 border-r border-white/10">
          <Search className="w-5 h-5 text-violet-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama kost atau alamat..."
            className="bg-transparent text-white placeholder-gray-500 text-sm w-full outline-none"
          />
        </div>

        <div className="flex items-center gap-3 px-5 py-4 border-r border-white/10 min-w-[180px]">
          <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-transparent text-sm w-full outline-none text-gray-300 cursor-pointer"
          >
            <option value="" className="bg-gray-900 text-white">Semua Kota</option>
            {INDONESIAN_CITIES.map((c) => (
              <option key={c} value={c} className="bg-gray-900 text-white">
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-4 py-4 text-sm text-gray-400 hover:text-white border-r border-white/10 transition-colors",
            showFilters && "text-violet-300"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:block">Filter</span>
        </button>

        <button
          type="submit"
          className="px-6 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold text-sm transition-all whitespace-nowrap"
        >
          Cari Kost
        </button>
      </div>

      {/* Filter row */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-4 px-5 py-4 border-t border-white/5 bg-white/2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Tipe:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-gray-800 border border-white/10 text-white text-xs rounded-lg px-3 py-1.5 outline-none cursor-pointer"
            >
              <option value="">Semua Tipe</option>
              {KOST_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="w-3 h-3 text-gray-500" />
            <label className="text-xs text-gray-500">Maks. Harga/bln:</label>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="bg-gray-800 border border-white/10 text-white text-xs rounded-lg px-3 py-1.5 outline-none cursor-pointer"
            >
              <option value="">Semua Harga</option>
              <option value="500000">Rp 500.000</option>
              <option value="1000000">Rp 1.000.000</option>
              <option value="1500000">Rp 1.500.000</option>
              <option value="2000000">Rp 2.000.000</option>
              <option value="3000000">Rp 3.000.000</option>
            </select>
          </div>
        </div>
      )}
    </form>
  );
}
