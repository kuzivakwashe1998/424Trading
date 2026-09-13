import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True when real Supabase credentials are configured via .env */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * The shared Supabase client. When no credentials are configured the app
 * runs in "demo mode" against bundled sample data so every page still works.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: false },
    })
  : null;

export const SUPABASE_URL = url ?? "";

/** Builds a public URL for an object stored in the `product-images` bucket. */
export function storagePublicUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
}
