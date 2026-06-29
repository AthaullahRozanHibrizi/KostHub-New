import { KostForm } from "@/components/dashboard/KostForm";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Tambah Kost Baru" };

export default function NewKostPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Tambah Kost Baru</h1>
        <p className="text-gray-500 text-sm mt-1">Isi informasi lengkap tentang properti Anda</p>
      </div>
      <KostForm />
    </div>
  );
}
