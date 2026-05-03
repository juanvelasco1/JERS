/**
 * Tras el último persist del diagnóstico, el id a vincular es el que ya tenía la fila
 * o el que devolvió el INSERT (antes `persistOnboarding` devolvía `null` si limpiaba el ref).
 */
export function resolveSubmissionIdForClaim(
  refBeforePersist: string | null,
  persistReturnedRowId: string | null,
): string | null {
  return refBeforePersist ?? persistReturnedRowId ?? null;
}
