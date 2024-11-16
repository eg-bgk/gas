import { env } from "@/env.mjs";
import { createClient } from "@/lib/supabase/client";

export const SUPABASE_BUCKET_BASE_URL = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets`;

function getUniqueFileName(file: File) {
  const extension = file.name.split(".").pop();
  const fileNameWithoutExtension = file.name.replace(`.${extension}`, "");
  const formattedFileName = fileNameWithoutExtension
    .replaceAll(" ", "-")
    .replaceAll("_", "")
    .replaceAll(".", "-");

  return `${formattedFileName}_${crypto.randomUUID().slice(0, 2)}.${extension}`;
}

export async function uploadFileToSupabase(file: File, filePath?: string) {
  if (!file) return;

  const supabase = createClient();
  const bytes = await file.arrayBuffer();
  const bucket = supabase.storage.from("assets");

  const fileName = filePath ?? getUniqueFileName(file);

  const mimeType = file.type; // Get the MIME type from the file object

  const { error } = await bucket.upload(fileName, bytes, {
    upsert: true,
    contentType: mimeType,
  });

  if (error) {
    console.log("Error uploading file:", error);
    throw error;
  }

  return bucket.getPublicUrl(fileName).data.publicUrl;
}
