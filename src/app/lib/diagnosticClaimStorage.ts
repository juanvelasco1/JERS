import type { SupabaseClient } from "@supabase/supabase-js";

/** Misma clave que usa Onboarding / FollowUpSidePanel para el id pendiente de reclamar. */
export const ONBOARDING_CLAIM_SUBMISSION_STORAGE_KEY = "onboarding_claim_submission_v1";

/** Clave con la que Onboarding persiste el `id` de fila activa (misma fila que se puede reclamar). */
export const ONBOARDING_SUBMISSION_ID_STORAGE_KEY = "onboarding_submission_id_v1";

/**
 * Si hay un id en localStorage y el usuario ya tiene sesión, ejecuta `claim_onboarding_submission`.
 * Prueba el ticket de post-diagnóstico y, si no hay, el id de fila guardado durante el flujo (`onboarding_submission_id_v1`).
 */
export async function tryClaimPendingSubmissionFromStorage(client: SupabaseClient): Promise<boolean> {
  const {
    data: { session },
  } = await client.auth.getSession();
  if (!session?.user) return false;

  const keysToTry = [ONBOARDING_CLAIM_SUBMISSION_STORAGE_KEY, ONBOARDING_SUBMISSION_ID_STORAGE_KEY] as const;

  for (const key of keysToTry) {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      continue;
    }
    const trimmed = raw?.trim();
    if (!trimmed) continue;

    const { data: ok, error } = await client.rpc("claim_onboarding_submission", { p_submission: trimmed });
    if (error) {
      console.warn(`tryClaimPendingSubmissionFromStorage (${key}):`, error);
      continue;
    }
    if (ok === true) {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
      return true;
    }
  }
  return false;
}
