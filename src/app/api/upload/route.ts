import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImageToSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ganti spasi dengan dash untuk nama file
    const safeFileName = file.name.replace(/\s+/g, "-");

    // Upload menggunakan Supabase Storage
    const url = await uploadImageToSupabase(buffer, safeFileName, file.type, "kosthub");
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Gagal mengupload gambar ke Supabase" }, { status: 500 });
  }
}
