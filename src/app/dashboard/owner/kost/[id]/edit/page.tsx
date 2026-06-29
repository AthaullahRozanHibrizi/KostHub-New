import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { KostForm } from "@/components/dashboard/KostForm";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Kost" };

interface Props { params: Promise<{ id: string }> }

export default async function EditKostPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session || session.user.role !== "OWNER") redirect("/login");

  const kost = await prisma.kost.findUnique({
    where: { id, ownerId: session.user.id },
  });

  if (!kost) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Edit Kost</h1>
        <p className="text-gray-500 text-sm mt-1">{kost.name}</p>
      </div>
      <KostForm initialData={{
        ...kost,
        latitude: kost.latitude?.toString(),
        longitude: kost.longitude?.toString(),
      }} kostId={kost.id} />
    </div>
  );
}
