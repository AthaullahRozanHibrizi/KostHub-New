"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard, Home, PlusSquare, BookOpen, Heart, User, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const OWNER_NAV = [
  { href: "/dashboard/owner", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/owner/kost", label: "Properti Saya", icon: Home },
  { href: "/dashboard/owner/kost/new", label: "Tambah Kost", icon: PlusSquare },
  { href: "/dashboard/owner/bookings", label: "Booking Masuk", icon: BookOpen },
];

const TENANT_NAV = [
  { href: "/dashboard/tenant", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/tenant/bookings", label: "Riwayat Booking", icon: BookOpen },
  { href: "/dashboard/tenant/favorites", label: "Kost Favorit", icon: Heart },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isOwner = session?.user?.role === "OWNER";
  const navItems = isOwner ? OWNER_NAV : TENANT_NAV;

  return (
    <aside className="w-64 min-h-screen glass border-r border-white/5 flex flex-col">
      {/* Profile */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold shrink-0">
            {session?.user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{session?.user?.name}</p>
            <p className="text-xs text-violet-300">{isOwner ? "Pemilik Kost" : "Pencari Kost"}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group",
                isActive
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-violet-400" : "text-gray-500 group-hover:text-gray-300")} />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="w-3 h-3" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/5">
        <Link href="/kost" className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-2">
          <Home className="w-3 h-3" />
          Kembali ke Beranda
        </Link>
      </div>
    </aside>
  );
}
