"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export function BookingActions({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateStatus = async (status: "CONFIRMED" | "REJECTED") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Gagal mengubah status");
      toast.success(status === "CONFIRMED" ? "Booking dikonfirmasi!" : "Booking ditolak.");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => updateStatus("CONFIRMED")}
        disabled={loading}
        className="flex items-center gap-1 px-2.5 py-1 text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50"
      >
        <Check className="w-3 h-3" /> Terima
      </button>
      <button
        onClick={() => updateStatus("REJECTED")}
        disabled={loading}
        className="flex items-center gap-1 px-2.5 py-1 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
      >
        <X className="w-3 h-3" /> Tolak
      </button>
    </div>
  );
}
