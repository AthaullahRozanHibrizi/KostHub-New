import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Star, Wifi, Wind, Bath, Bed } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Kost } from "@/types";
import { cn } from "@/lib/utils";

const FACILITY_ICONS: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi className="w-3 h-3" />,
  "AC": <Wind className="w-3 h-3" />,
  "Kamar Mandi Dalam": <Bath className="w-3 h-3" />,
  "Kasur": <Bed className="w-3 h-3" />,
};

const TYPE_BADGE: Record<string, string> = {
  PUTRA: "from-blue-500 to-blue-700",
  PUTRI: "from-pink-500 to-pink-700",
  CAMPUR: "from-violet-500 to-violet-700",
};

const TYPE_LABEL: Record<string, string> = {
  PUTRA: "Putra",
  PUTRI: "Putri",
  CAMPUR: "Campur",
};

interface KostCardProps {
  kost: Kost;
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
  className?: string;
}

export function KostCard({ kost, isFavorited, onFavoriteToggle, className }: KostCardProps) {
  const minPrice = kost.minPrice ?? kost.rooms?.[0]?.price ?? 0;
  const avgRating = kost.avgRating ?? 0;
  const reviewCount = kost._count?.reviews ?? 0;
  const mainImage = kost.images?.[0] ?? "/placeholder-kost.jpg";

  return (
    <Link
      href={`/kost/${kost.id}`}
      className={cn(
        "group glass glass-hover rounded-2xl overflow-hidden border border-white/8 block",
        className
      )}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <Image
          src={mainImage}
          alt={kost.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

        {/* Type Badge */}
        <div className={cn(
          "absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold text-white bg-gradient-to-r",
          TYPE_BADGE[kost.type]
        )}>
          Kost {TYPE_LABEL[kost.type]}
        </div>

        {/* Favorite Button */}
        {onFavoriteToggle && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFavoriteToggle(kost.id);
            }}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-900/70 hover:bg-gray-800 transition-all backdrop-blur-sm"
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-colors",
                isFavorited ? "text-red-400 fill-red-400" : "text-gray-300"
              )}
            />
          </button>
        )}

        {/* Rating overlay */}
        {reviewCount > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-gray-900/70 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-white font-medium">{avgRating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({reviewCount})</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm leading-snug mb-1 group-hover:text-violet-300 transition-colors line-clamp-1">
          {kost.name}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 mb-3">
          <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
          <span className="text-xs line-clamp-1">
            {kost.district}, {kost.city}
          </span>
        </div>

        {/* Facilities */}
        <div className="flex flex-wrap gap-1 mb-3">
          {kost.facilities.slice(0, 4).map((f) => (
            <span
              key={f}
              className="flex items-center gap-1 px-2 py-0.5 bg-white/5 border border-white/8 rounded-full text-xs text-gray-400"
            >
              {FACILITY_ICONS[f]}
              {f}
            </span>
          ))}
          {kost.facilities.length > 4 && (
            <span className="px-2 py-0.5 bg-white/5 border border-white/8 rounded-full text-xs text-gray-500">
              +{kost.facilities.length - 4}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gradient">
              {formatCurrency(minPrice)}
            </span>
            <span className="text-xs text-gray-500">/bulan</span>
          </div>
          <span className="text-xs px-2 py-1 bg-violet-500/10 text-violet-300 rounded-lg border border-violet-500/20">
            Lihat Detail →
          </span>
        </div>
      </div>
    </Link>
  );
}
