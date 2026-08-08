import { createClient } from "@supabase/supabase-js";

const ACTIVITY_PHOTOS_BUCKET = "activity-photos";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase Storage não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export async function uploadActivityPhoto(
  userId: string,
  file: File
): Promise<string> {
  const supabase = getAdminClient();

  const extension = file.type === "image/png" ? "png" : "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(ACTIVITY_PHOTOS_BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Falha ao enviar a foto: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(ACTIVITY_PHOTOS_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}
