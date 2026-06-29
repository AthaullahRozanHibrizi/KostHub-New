"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Calendar, Clock, MessageSquare } from "lucide-react";
import { Room } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface BookingFormProps {
  kostId: string;
  rooms: Room[];
  ownerPhone?: string | null;
}

export function BookingForm({ kostId, rooms, ownerPhone }: BookingFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(
    rooms.find((r) => r.status === "AVAILABLE") || null
  );
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const availableRooms = rooms.filter((r) => r.status === "AVAILABLE");
  const totalPrice = selectedRoom ? selectedRoom.price * duration : 0;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/login");
      return;
    }
    if (!selectedRoom || !startDate) return;

    setLoading(true);
    try {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setMonth(end.getMonth() + duration);

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kostId,
          roomId: selectedRoom.id,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          duration,
          totalPrice,
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal melakukan booking");
      }

      toast.success("Booking berhasil! Menunggu konfirmasi pemilik.");
      router.push("/dashboard/tenant/bookings");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (availableRooms.length === 0) {
    return (
      <div className="glass rounded-2xl border border-white/10 p-6 text-center">
        <p className="text-gray-400 text-sm mb-4">Semua kamar sedang penuh.</p>
        {ownerPhone && (
          <a
            href={`https://wa.me/${ownerPhone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-xl transition-colors"
          >
            Hubungi via WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl border border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Booking Kamar</h3>

      <form onSubmit={handleBooking} className="space-y-4">
        {/* Room Selection */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Pilih Kamar</label>
          <div className="space-y-2">
            {availableRooms.map((room) => (
              <label
                key={room.id}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedRoom?.id === room.id
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-white/10 hover:border-white/20 bg-white/2"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="room"
                    value={room.id}
                    checked={selectedRoom?.id === room.id}
                    onChange={() => setSelectedRoom(room)}
                    className="accent-violet-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{room.name}</p>
                    {room.size && <p className="text-xs text-gray-500">Ukuran: {room.size}</p>}
                  </div>
                </div>
                <span className="text-sm font-bold text-violet-300">
                  {formatCurrency(room.price)}/bln
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            <Calendar className="w-3 h-3 inline mr-1" />
            Tanggal Mulai
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
            className="w-full bg-gray-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            <Clock className="w-3 h-3 inline mr-1" />
            Durasi Sewa
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full bg-gray-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
          >
            {[1, 2, 3, 6, 12].map((m) => (
              <option key={m} value={m} className="bg-gray-900">
                {m} Bulan
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            <MessageSquare className="w-3 h-3 inline mr-1" />
            Catatan (opsional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Pesan atau pertanyaan untuk pemilik..."
            className="w-full bg-gray-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
          />
        </div>

        {/* Price Summary */}
        {selectedRoom && (
          <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-400">
                {formatCurrency(selectedRoom.price)} × {duration} bulan
              </span>
              <span className="text-white font-semibold">{formatCurrency(totalPrice)}</span>
            </div>
            <p className="text-xs text-gray-600">*Harga belum termasuk deposit</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !selectedRoom || !startDate}
          className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/20"
        >
          {loading ? "Memproses..." : session ? "Ajukan Booking" : "Login untuk Booking"}
        </button>

        {ownerPhone && (
          <a
            href={`https://wa.me/${ownerPhone.replace(/\D/g, "")}?text=Halo, saya tertarik dengan kost Anda`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 text-center text-sm text-green-400 border border-green-500/30 hover:bg-green-500/10 rounded-xl transition-colors"
          >
            💬 Tanya via WhatsApp
          </a>
        )}
      </form>
    </div>
  );
}
