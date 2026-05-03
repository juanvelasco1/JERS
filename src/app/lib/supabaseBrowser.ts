/// <reference types="vite/client" />
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Un solo cliente en el navegador: varias instancias con persistSession compiten
 * por las mismas claves en localStorage y pueden provocar bucles de auth / “recargas”.
 */
let browserClient: SupabaseClient | null | undefined;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  if (browserClient !== undefined) return browserClient;

  const projectId = (import.meta.env.VITE_PROJECT_ID as string | undefined)?.trim();
  const url =
    (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim()
    || (projectId ? `https://${projectId}.supabase.co` : undefined);
  const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();
  if (!url || !key) {
    browserClient = null;
    return null;
  }

  browserClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
  return browserClient;
}
