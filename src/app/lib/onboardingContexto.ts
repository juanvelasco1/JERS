export const CONTEXTO_ACTUAL_VALUES = ["ya_tengo", "idea", "cero"] as const;
export type ContextoActualValue = (typeof CONTEXTO_ACTUAL_VALUES)[number];

export function isValidContextoActual(value: string | undefined | null): value is ContextoActualValue {
  return !!value && (CONTEXTO_ACTUAL_VALUES as readonly string[]).includes(value);
}

export function sanitizeStorageFileName(name: string): string {
  const base = name.split(/[/\\]/).pop() || "file";
  return base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 180) || "file";
}

export type ContextoArchivoMeta = {
  path: string;
  name: string;
  size: number;
  url: string;
};
