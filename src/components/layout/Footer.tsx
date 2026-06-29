import Link from "next/link";
import { Home, Mail, Phone, MessageCircle, Share2, PlayCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-gray-950/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gradient">KostHub</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Platform terbaik untuk mencari dan menyewakan kost di seluruh Indonesia.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-violet-300 transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-violet-300 transition-all">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-violet-300 transition-all">
                <PlayCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Layanan</h3>
            <ul className="space-y-2">
              {[
                { label: "Cari Kost", href: "/kost" },
                { label: "Daftarkan Kost", href: "/register" },
                { label: "Promo & Diskon", href: "#" },
                { label: "KostHub Premium", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-500 hover:text-violet-300 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Perusahaan</h3>
            <ul className="space-y-2">
              {[
                { label: "Tentang Kami", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Karir", href: "#" },
                { label: "Hubungi Kami", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-500 hover:text-violet-300 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="w-4 h-4 text-violet-400 shrink-0" />
                support@kosthub.id
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Phone className="w-4 h-4 text-violet-400 shrink-0" />
                +62 812-3456-7890
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} KostHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
