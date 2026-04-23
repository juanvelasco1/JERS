import { sanitizeStorageFileName } from "@/app/lib/onboardingContexto";

/** Bucket Storage: archivos del diagnóstico, agrupados por el id de la fila que los sube (`onboarding_submissions.id`). */
export const DIAGNOSTICO_CLIENTES_BUCKET = "diagnostico-clientes" as const;

/**
 * Ruta de objeto en Storage: `{submissionId}/uploads/{timestamp}-{nombre}`.
 * La primera carpeta debe coincidir con la fila en Supabase (política RLS).
 */
export function buildDiagnosticoClienteObjectPath(
  submissionId: string,
  originalFileName: string,
  nowMs: number = Date.now(),
): string {
  const safe = sanitizeStorageFileName(originalFileName);
  return `${submissionId}/uploads/${nowMs}-${safe}`;
}
