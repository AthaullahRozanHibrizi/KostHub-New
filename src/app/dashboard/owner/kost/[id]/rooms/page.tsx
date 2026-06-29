import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { RoomManager } from "@/components/dashboard/RoomManager";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Manajemen Kamar" };

interface Props { params: Promise<{ id: string }> }

export default async function RoomsPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session || session.user.role !== "OWNER") redirect("/login");

  const kost = await prisma.kost.findUnique({
    where: { id, ownerId: session.user.id },
    include: { rooms: { orderBy: { name: "asc" } } },
  });

  if (!kost) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/owner/kost" className="p-2 rounded-xl glass border border-white/10 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Kamar</h1>
          <p className="text-gray-500 text-sm mt-0.5">{kost.name}</p>
        </div>
      </div>

      <RoomManager kostId={kost.id} initialRooms={kost.rooms as any} />
    </div>
  );
}
