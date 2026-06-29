import { SearchBar } from "@/components/landing/SearchBar";
import { Home, Star, Shield, MapPin } from "lucide-react";

const STATS = [
  { label: "Kost Tersedia", value: "10.000+", icon: Home },
  { label: "Kota Terjangkau", value: "50+", icon: MapPin },
  { label: "Pengguna Aktif", value: "25.000+", icon: Star },
  { label: "Transaksi Aman", value: "99.9%", icon: Shield },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/8 blur-3xl animate-float-delay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-800/5 blur-3xl animate-pulse-slow" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-violet-500/20 text-xs text-violet-300 font-medium mb-8 shadow-lg shadow-violet-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Platform Kost #1 di Indonesia
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
          Temukan Kost{" "}
          <span className="text-gradient">Impian</span>
          <br />
          Anda Sekarang
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Ribuan pilihan kost terjangkau dengan fasilitas lengkap di seluruh Indonesia.
          Booking mudah, harga transparan, tanpa biaya tersembunyi.
        </p>

        {/* Search Bar */}
        <SearchBar className="max-w-3xl mx-auto mb-12 shadow-2xl shadow-violet-500/10" />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass rounded-xl p-4 border border-white/5">
              <Icon className="w-5 h-5 text-violet-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />
    </section>
  );
}
