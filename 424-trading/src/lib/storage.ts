import { supabase, storagePublicUrl } from "./supabaseClient";

/**
 * Uploads a product image to the `product-images` Supabase Storage bucket
 * and returns its public URL. The bucket must exist and be public
 * (created automatically by supabase/schema.sql).
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (!supabase) {
    throw new Error(
      "Image upload needs a Supabase connection. Configure .env first (see Admin → Setup)."
    );
  }
  const safe = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const path = `products/${Date.now()}-${safe}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(error.message);
  return storagePublicUrl(path);
}

/** Uploads a category image to the same bucket under categories/. */
export async function uploadCategoryImage(file: File): Promise<string> {
  if (!supabase) {
    throw new Error(
      "Image upload needs a Supabase connection. Configure .env first (see Admin → Setup)."
    );
  }
  const safe = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const path = `categories/${Date.now()}-${safe}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(error.message);
  return storagePublicUrl(path);
}
