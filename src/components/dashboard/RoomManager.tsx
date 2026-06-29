"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Room } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ROOM_STATUS_MAP: Record<string, { label: string; color: string }> = {
  AVAILABLE: { label: "Tersedia", color: "green" },
  OCCUPIED: { label: "Terisi", color: "red" },
  MAINTENANCE: { label: "Maintenance", color: "yellow" },
};

interface RoomManagerProps {
  kostId: string;
  initialRooms: Room[];
}

export function RoomManager({ kostId, initialRooms }: RoomManagerProps) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    priceYear: "",
    size: "",
    floor: "",
    status: "AVAILABLE" as Room["status"],
  });

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", priceYear: "", size: "", floor: "", status: "AVAILABLE" });
    setEditingRoom(null);
    setShowForm(false);
  };

  const openEdit = (room: Room) => {
    setEditingRoom(room);
    setForm({
      name: room.name,
      description: room.description || "",
      price: room.price.toString(),
      priceYear: room.priceYear?.toString() || "",
      size: room.size || "",
      floor: room.floor?.toString() || "",
      status: room.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        kostId,
        price: parseFloat(form.price),
        priceYear: form.priceYear ? parseFloat(form.priceYear) : null,
        floor: form.floor ? parseInt(form.floor) : null,
      };

      const url = editingRoom ? `/api/rooms/${editingRoom.id}` : "/api/rooms";
      const method = editingRoom ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan kamar");
      const data = await res.json();

      if (editingRoom) {
        setRooms((r) => r.map((rm) => rm.id === editingRoom.id ? data : rm));
        toast.success("Kamar berhasil diperbarui!");
      } else {
        setRooms((r) => [...r, data]);
        toast.success("Kamar berhasil ditambahkan!");
      }
      resetForm();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm("Hapus kamar ini?")) return;
    try {
      const res = await fetch(`/api/rooms/${roomId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus kamar");
      setRooms((r) => r.filter((rm) => rm.id !== roomId));
      toast.success("Kamar dihapus!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-4">
      {/* Room List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rooms.map((room) => {
          const status = ROOM_STATUS_MAP[room.status];
          return (
            <div key={room.id} className="glass rounded-xl border border-white/8 p-4 hover:border-white/15 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-white">{room.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {room.size && <span className="text-xs text-gray-500">{room.size}</span>}
                    {room.floor && <span className="text-xs text-gray-500">Lantai {room.floor}</span>}
                  </div>
                </div>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-medium",
                  `bg-${status.color}-500/10 text-${status.color}-400 border border-${status.color}-500/20`
                )}>
                  {status.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gradient">{formatCurrency(room.price)}/bln</span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(room)} className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(room.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Room Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 hover:border-violet-500/40 hover:bg-violet-500/5 p-6 text-gray-500 hover:text-violet-300 transition-all min-h-[100px]"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm">Tambah Kamar</span>
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass rounded-2xl border border-violet-500/20 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">{editingRoom ? "Edit Kamar" : "Tambah Kamar Baru"}</h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Nama Kamar *</label>
              <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Kamar A1" required
                className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Harga/Bulan (Rp) *</label>
              <input value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} type="number" placeholder="1500000" required
                className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Harga/Tahun (Rp)</label>
              <input value={form.priceYear} onChange={(e) => setForm(f => ({ ...f, priceYear: e.target.value }))} type="number" placeholder="15000000"
                className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Ukuran</label>
              <input value={form.size} onChange={(e) => setForm(f => ({ ...f, size: e.target.value }))} placeholder="3x4 m²"
                className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Lantai</label>
              <input value={form.floor} onChange={(e) => setForm(f => ({ ...f, floor: e.target.value }))} type="number" placeholder="1"
                className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as any }))}
                className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer">
                <option value="AVAILABLE" className="bg-gray-900">Tersedia</option>
                <option value="OCCUPIED" className="bg-gray-900">Terisi</option>
                <option value="MAINTENANCE" className="bg-gray-900">Maintenance</option>
              </select>
            </div>
            <div className="col-span-2 flex gap-3">
              <button type="button" onClick={resetForm} className="flex-1 py-2 text-sm text-gray-400 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
                Batal
              </button>
              <button type="submit" disabled={loading} className="flex-1 py-2 text-sm bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-1">
                <Check className="w-4 h-4" />
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
