import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { KostGallery } from "@/components/kost/KostGallery";
import { FacilitiesList } from "@/components/kost/FacilitiesList";
import { BookingForm } from "@/components/kost/BookingForm";
import { MapEmbedWrapper } from "@/components/kost/MapEmbed";
import { MapPin, Star, Users, Phone, Shield, CheckCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

async function getKost(id: string) {
  const kost = await prisma.kost.findUnique({
    where: { id, isActive: true },
    include: {
      owner: { select: { id: true, name: true, phone: true, avatar: true, createdAt: true } },
      rooms: { orderBy: { price: "asc" } },
      reviews: {
        include: { user: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      _count: { select: { reviews: true, rooms: true } },
    },
  });
  return kost;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const kost = await getKost(id);
  if (!kost) return { title: "Kost tidak ditemukan" };
  return {
    title: kost.name,
    description: kost.description.slice(0, 160),
  };
}

export default async function KostDetailPage({ params }: Props) {
  const { id } = await params;
  const kost = await getKost(id);
  if (!kost) notFound();

  const avgRating =
    kost.reviews.length > 0
      ? kost.reviews.reduce((s, r) => s + r.rating, 0) / kost.reviews.length
      : 0;

  const minPrice = kost.rooms[0]?.price ?? 0;

  const TYPE_LABEL: Record<string, string> = { PUTRA: "Putra", PUTRI: "Putri", CAMPUR: "Campur" };

  return (
    <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto">
      {/* Gallery */}
      <KostGallery images={kost.images} name={kost.name} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 mb-2 inline-block">
                  Kost {TYPE_LABEL[kost.type]}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{kost.name}</h1>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gradient">{formatCurrency(minPrice)}</div>
                <div className="text-sm text-gray-500">/bulan</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {kost.address}, {kost.district}, {kost.city}
              </span>
              {avgRating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {avgRating.toFixed(1)} ({kost._count.reviews} ulasan)
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-violet-400" />
                {kost._count.rooms} kamar
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="glass rounded-2xl border border-white/8 p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Deskripsi</h2>
            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{kost.description}</p>
          </div>

          {/* Facilities */}
          <div className="glass rounded-2xl border border-white/8 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Fasilitas</h2>
            <FacilitiesList facilities={kost.facilities} />
          </div>

          {/* Rooms */}
          {kost.rooms.length > 0 && (
            <div className="glass rounded-2xl border border-white/8 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Kamar Tersedia</h2>
              <div className="space-y-3">
                {kost.rooms.map((room) => (
                  <div key={room.id} className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/8">
                    <div>
                      <p className="text-sm font-medium text-white">{room.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {room.size && <span className="text-xs text-gray-500">{room.size}</span>}
                        {room.floor && <span className="text-xs text-gray-500">Lantai {room.floor}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gradient">{formatCurrency(room.price)}/bln</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        room.status === "AVAILABLE"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                      }`}>
                        {room.status === "AVAILABLE" ? "Tersedia" : "Terisi"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules */}
          {kost.rules.length > 0 && (
            <div className="glass rounded-2xl border border-white/8 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-violet-400" />
                Peraturan Kost
              </h2>
              <ul className="space-y-2">
                {kost.rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Map */}
          {kost.latitude && kost.longitude && (
            <div className="glass rounded-2xl border border-white/8 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Lokasi
              </h2>
              <MapEmbedWrapper lat={kost.latitude} lng={kost.longitude} name={kost.name} />
              <p className="text-xs text-gray-500 mt-2">{kost.address}</p>
            </div>
          )}

          {/* Reviews */}
          {kost.reviews.length > 0 && (
            <div className="glass rounded-2xl border border-white/8 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                Ulasan ({kost._count.reviews})
              </h2>
              <div className="mb-4 flex items-center gap-3">
                <div className="text-4xl font-bold text-gradient">{avgRating.toFixed(1)}</div>
                <div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-700"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{kost._count.reviews} ulasan</p>
                </div>
              </div>
              <div className="space-y-4">
                {kost.reviews.map((review) => (
                  <div key={review.id} className="border-t border-white/5 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
                          {review.user.name[0]}
                        </div>
                        <span className="text-sm text-white">{review.user.name}</span>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-700"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{review.comment}</p>
                    <p className="text-xs text-gray-600 mt-1">{formatDate(review.createdAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <BookingForm
              kostId={kost.id}
              rooms={kost.rooms as any}
              ownerPhone={kost.owner.phone}
            />

            {/* Owner Card */}
            <div className="glass rounded-2xl border border-white/8 p-5">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Pemilik Kost</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                  {kost.owner.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{kost.owner.name}</p>
                  <p className="text-xs text-gray-500">
                    Bergabung {formatDate(kost.owner.createdAt)}
                  </p>
                </div>
              </div>
              {kost.owner.phone && (
                <a
                  href={`tel:${kost.owner.phone}`}
                  className="mt-3 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-violet-400" />
                  {kost.owner.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
