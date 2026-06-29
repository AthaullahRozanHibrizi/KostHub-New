"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FACILITIES, KOST_TYPES, INDONESIAN_CITIES } from "@/lib/utils";
import { Plus, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(3, "Minimal 3 karakter"),
  description: z.string().min(20, "Minimal 20 karakter"),
  address: z.string().min(5, "Masukkan alamat lengkap"),
  district: z.string().min(2, "Masukkan kecamatan"),
  city: z.string().min(2, "Pilih kota"),
  province: z.string().min(2, "Masukkan provinsi"),
  type: z.enum(["PUTRA", "PUTRI", "CAMPUR"]),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface KostFormProps {
  initialData?: any;
  kostId?: string;
}

export function KostForm({ initialData, kostId }: KostFormProps) {
  const router = useRouter();
  const isEditing = !!kostId;

  const [facilities, setFacilities] = useState<string[]>(initialData?.facilities || []);
  const [rules, setRules] = useState<string[]>(initialData?.rules || []);
  const [newRule, setNewRule] = useState("");
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || { type: "CAMPUR" },
  });

  const toggleFacility = (f: string) => {
    setFacilities((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const addRule = () => {
    if (newRule.trim()) {
      setRules((prev) => [...prev, newRule.trim()]);
      setNewRule("");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          setImages((prev) => [...prev, data.url]);
        }
      }
      toast.success("Foto berhasil diupload!");
    } catch {
      toast.error("Gagal mengupload foto");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        facilities,
        rules,
        images,
      };

      const res = await fetch(isEditing ? `/api/kost/${kostId}` : "/api/kost", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menyimpan data");
      }

      toast.success(isEditing ? "Kost berhasil diperbarui!" : "Kost berhasil ditambahkan!");
      router.push("/dashboard/owner/kost");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {/* Basic Info */}
      <div className="glass rounded-2xl border border-white/8 p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Informasi Dasar</h2>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Nama Kost *</label>
          <input {...register("name")} placeholder="Kost Melati Indah" className="input-field" />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Deskripsi *</label>
          <textarea {...register("description")} rows={4} placeholder="Ceritakan tentang kost Anda..." className="input-field resize-none" />
          {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Tipe Kost *</label>
          <select {...register("type")} className="input-field cursor-pointer">
            {KOST_TYPES.map((t) => (
              <option key={t.value} value={t.value} className="bg-gray-900">{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div className="glass rounded-2xl border border-white/8 p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Lokasi</h2>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Alamat Lengkap *</label>
          <input {...register("address")} placeholder="Jl. Raya No. 123, RT 01/RW 02" className="input-field" />
          {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Kecamatan *</label>
            <input {...register("district")} placeholder="Kebayoran Baru" className="input-field" />
            {errors.district && <p className="text-xs text-red-400 mt-1">{errors.district.message}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Kota *</label>
            <select {...register("city")} className="input-field cursor-pointer">
              <option value="" className="bg-gray-900">Pilih Kota</option>
              {INDONESIAN_CITIES.map((c) => (
                <option key={c} value={c} className="bg-gray-900">{c}</option>
              ))}
            </select>
            {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Provinsi *</label>
          <input {...register("province")} placeholder="DKI Jakarta" className="input-field" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Latitude (opsional)</label>
            <input {...register("latitude")} placeholder="-6.2088" className="input-field" type="number" step="any" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Longitude (opsional)</label>
            <input {...register("longitude")} placeholder="106.8456" className="input-field" type="number" step="any" />
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div className="glass rounded-2xl border border-white/8 p-6">
        <h2 className="text-base font-semibold text-white mb-4">Fasilitas</h2>
        <div className="flex flex-wrap gap-2">
          {FACILITIES.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => toggleFacility(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                facilities.includes(f)
                  ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                  : "bg-white/3 border-white/10 text-gray-400 hover:border-white/20"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div className="glass rounded-2xl border border-white/8 p-6">
        <h2 className="text-base font-semibold text-white mb-4">Peraturan Kost</h2>
        <div className="flex gap-2 mb-3">
          <input
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRule())}
            placeholder="Tambah peraturan..."
            className="input-field flex-1"
          />
          <button type="button" onClick={addRule} className="p-2 bg-violet-500/20 border border-violet-500/30 text-violet-300 rounded-xl hover:bg-violet-500/30 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-2">
          {rules.map((rule, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white/3 rounded-lg border border-white/5">
              <span className="flex-1 text-sm text-gray-300">{rule}</span>
              <button type="button" onClick={() => setRules((r) => r.filter((_, idx) => idx !== i))} className="text-gray-600 hover:text-red-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="glass rounded-2xl border border-white/8 p-6">
        <h2 className="text-base font-semibold text-white mb-4">Foto Kost</h2>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 rounded-xl py-8 cursor-pointer hover:border-violet-500/40 hover:bg-violet-500/5 transition-all">
          <Upload className="w-8 h-8 text-gray-500 mb-2" />
          <span className="text-sm text-gray-400">{uploading ? "Mengupload..." : "Klik untuk upload foto"}</span>
          <span className="text-xs text-gray-600 mt-1">JPG, PNG hingga 5MB</span>
          <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} />
        </label>
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {images.map((url, i) => (
              <div key={i} className="relative aspect-video rounded-lg overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`foto ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((imgs) => imgs.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-white/15 text-gray-300 hover:text-white hover:border-white/25 rounded-xl text-sm transition-all"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/20"
        >
          {loading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Kost"}
        </button>
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus {
          border-color: rgba(139,92,246,0.5);
        }
        .input-field::placeholder {
          color: rgb(75,85,99);
        }
      `}</style>
    </form>
  );
}
