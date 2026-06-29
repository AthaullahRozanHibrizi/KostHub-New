import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: "violet" | "cyan" | "green" | "yellow";
}

const colorMap = {
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", icon: "text-violet-400", badge: "bg-violet-500/10 text-violet-300" },
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", icon: "text-cyan-400", badge: "bg-cyan-500/10 text-cyan-300" },
  green: { bg: "bg-green-500/10", border: "border-green-500/20", icon: "text-green-400", badge: "bg-green-500/10 text-green-300" },
  yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: "text-yellow-400", badge: "bg-yellow-500/10 text-yellow-300" },
};

export function StatsCard({ title, value, subtitle, icon: Icon, trend, color = "violet" }: StatsCardProps) {
  const colors = colorMap[color];
  return (
    <div className="glass rounded-2xl border border-white/8 p-5 hover:border-white/15 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors.bg, "border", colors.border)}>
          <Icon className={cn("w-5 h-5", colors.icon)} />
        </div>
        {trend && (
          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", colors.badge)}>
            {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
      {subtitle && <div className="text-xs text-gray-600 mt-1">{subtitle}</div>}
    </div>
  );
}
