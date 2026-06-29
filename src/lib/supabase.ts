import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Menggunakan service role key agar bisa upload via API route (server-side) tanpa RLS issues
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function uploadImageToSupabase(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  folder: string = "kosthub"
): Promise<string> {
  const filePath = `${folder}/${Date.now()}-${fileName}`;

  const { data, error } = await supabase.storage
    .from("images") // Pastikan Anda sudah membuat bucket bernama 'images' di Supabase
    .upload(filePath, fileBuffer, {
      contentType,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase upload error: ${error.message}`);
  }

  // Dapatkan Public URL
  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
