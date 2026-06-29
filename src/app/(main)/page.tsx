import { HeroSection } from "@/components/landing/HeroSection";
import { PopularKost } from "@/components/landing/PopularKost";
import { Metadata } from "next";
import { Search, MapPin, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "KostHub – Temukan Kost Impian Anda",
  description: "Platform terbaik untuk mencari dan menyewakan kost di seluruh Indonesia.",
};

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Cari Kost",
    desc: "Temukan kost berdasarkan lokasi, harga, dan fasilitas yang Anda inginkan.",
    icon: Search,
    color: "violet",
  },
  {
    step: "02",
    title: "Pilih & Kunjungi",
    desc: "Lihat detail lengkap, foto galeri, dan hubungi pemilik untuk survei.",
    icon: MapPin,
    color: "cyan",
  },
  {
    step: "03",
    title: "Booking & Tinggal",
    desc: "Booking online dengan mudah dan mulai tinggal di kost impian Anda.",
    icon: Star,
    color: "violet",
  },
];

const CITY_SPOTS = [
  { name: "Jakarta", count: "2.500+ Kost", img: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=300&h=200&fit=crop" },
  { name: "Bandung", count: "1.800+ Kost", img: "https://images.unsplash.com/photo-1520637836993-5c9b7d432ce3?w=300&h=200&fit=crop" },
  { name: "Yogyakarta", count: "1.200+ Kost", img: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=300&h=200&fit=crop" },
  { name: "Surabaya", count: "1.500+ Kost", img: "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=300&h=200&fit=crop" },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Popular Kosts */}
      <PopularKost />

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Cara <span className="text-gradient">Mudah</span> Mencari Kost
            </h2>
            <p className="text-gray-500 text-sm">3 langkah mudah untuk temukan kost impian Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon, color }) => (
              <div key={step} className="glass rounded-2xl p-6 border border-white/5 text-center group hover:border-violet-500/20 transition-all">
                <div className="relative inline-flex mb-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    color === "violet" ? "bg-violet-500/10 border border-violet-500/20" : "bg-cyan-500/10 border border-cyan-500/20"
                  }`}>
                    <Icon className={`w-6 h-6 ${color === "violet" ? "text-violet-400" : "text-cyan-400"}`} />
                  </div>
                  <span className="absolute -top-2 -right-2 text-xs font-bold text-gray-600">{step}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">
            Kost di <span className="text-gradient">Kota Populer</span>
          </h2>
          <Link href="/kost" className="flex items-center gap-1 text-sm text-violet-300 hover:text-violet-200 group">
            Semua kota <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CITY_SPOTS.map(({ name, count, img }) => (
            <Link
              key={name}
              href={`/kost?city=${name}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="text-white font-semibold text-sm">{name}</p>
                <p className="text-gray-400 text-xs">{count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden glass border border-violet-500/20 p-10 md:p-16 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-cyan-600/5 pointer-events-none" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-violet-500/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Punya Kost? <span className="text-gradient">Daftarkan Sekarang!</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Bergabung dengan ribuan pemilik kost yang sudah mempercayakan properti mereka di KostHub. Kelola mudah, booking otomatis.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5"
            >
              Daftar Gratis Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
