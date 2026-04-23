/** Límite alineado con `storage.buckets.file_size_limit` del bucket de diagnóstico. */
export const DIAGNOSTICO_ARCHIVO_MAX_BYTES = 10 * 1024 * 1024;

/** Evita abusos en una sola sesión (varios archivos sí, pero con tope). */
export const DIAGNOSTICO_ARCHIVOS_MAX_COUNT = 25;

const VIDEO_MIME_PREFIX = "video/";

const VIDEO_EXT = new Set([
  "mp4",
  "webm",
  "mov",
  "avi",
  "mkv",
  "m4v",
  "ogv",
  "wmv",
  "flv",
  "mpeg",
  "mpg",
  "m2v",
  "3gp",
  "3g2",
  "ts",
  "m2ts",
  "vob",
]);

/** Extensiones permitidas (sin vídeo). Imágenes, PDF, Office, texto, zip. */
const ALLOWED_EXT = new Set([
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "bmp",
  "tif",
  "tiff",
  "svg",
  "heic",
  "heif",
  "ico",
  "doc",
  "docx",
  "dot",
  "dotx",
  "xls",
  "xlsx",
  "xlsm",
  "csv",
  "ppt",
  "pptx",
  "pps",
  "ppsx",
  "txt",
  "rtf",
  "md",
  "odt",
  "ods",
  "odp",
  "zip",
]);

const OFFICE_AND_DOC_MIMES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-word.document.macroenabled.12",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel.sheet.macroenabled.12",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint.presentation.macroenabled.12",
  "text/csv",
  "application/csv",
  "text/plain",
  "application/rtf",
  "text/rtf",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.oasis.opendocument.presentation",
  "application/zip",
  "application/x-zip-compressed",
]);

const EXT_TO_MIME: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  tif: "image/tiff",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  heic: "image/heic",
  heif: "image/heif",
  ico: "image/x-icon",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  dot: "application/msword",
  dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xlsm: "application/vnd.ms-excel.sheet.macroenabled.12",
  csv: "text/csv",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  pps: "application/vnd.ms-powerpoint",
  ppsx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain",
  rtf: "application/rtf",
  md: "text/plain",
  odt: "application/vnd.oasis.opendocument.text",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
  odp: "application/vnd.oasis.opendocument.presentation",
  zip: "application/zip",
};

export function getDiagnosticoFileExtension(filename: string): string {
  const base = filename.split(/[/\\]/).pop() || "";
  const dot = base.lastIndexOf(".");
  return dot >= 0 ? base.slice(dot + 1).toLowerCase() : "";
}

export function isVideoDiagnosticoFile(file: File): boolean {
  const t = (file.type || "").toLowerCase();
  if (t.startsWith(VIDEO_MIME_PREFIX)) return true;
  return VIDEO_EXT.has(getDiagnosticoFileExtension(file.name));
}

export function isDiagnosticoArchivoPermitido(file: File): boolean {
  if (isVideoDiagnosticoFile(file)) return false;
  const ext = getDiagnosticoFileExtension(file.name);
  if (ALLOWED_EXT.has(ext)) return true;
  const t = (file.type || "").toLowerCase();
  if (t.startsWith("image/")) return true;
  if (OFFICE_AND_DOC_MIMES.has(t)) return true;
  return false;
}

export type DiagnosticoArchivoRechazado = { file: File; reason: string };

export function partitionDiagnosticoArchivos(
  files: File[],
  opts?: {
    existingCount?: number;
    /** Por defecto coincide con el límite del bucket en Supabase. */
    maxBytesPerFile?: number;
    maxFilesTotal?: number;
  },
): { ok: File[]; rejected: DiagnosticoArchivoRechazado[] } {
  const existing = opts?.existingCount ?? 0;
  const maxBytes = opts?.maxBytesPerFile ?? DIAGNOSTICO_ARCHIVO_MAX_BYTES;
  const maxTotal = opts?.maxFilesTotal ?? DIAGNOSTICO_ARCHIVOS_MAX_COUNT;
  const rejected: DiagnosticoArchivoRechazado[] = [];
  const ok: File[] = [];
  let slot = Math.max(0, maxTotal - existing);

  for (const file of files) {
    if (slot <= 0) {
      rejected.push({ file, reason: `Máximo ${maxTotal} archivos por envío.` });
      continue;
    }
    if (file.size > maxBytes) {
      const sizeReason =
        maxBytes >= 1024 * 1024
          ? `Supera ${maxBytes / (1024 * 1024)} MB.`
          : `Demasiado grande (máx. ${maxBytes} bytes).`;
      rejected.push({ file, reason: sizeReason });
      continue;
    }
    if (isVideoDiagnosticoFile(file)) {
      rejected.push({ file, reason: "No se permiten vídeos." });
      continue;
    }
    if (!isDiagnosticoArchivoPermitido(file)) {
      rejected.push({ file, reason: "Tipo no permitido (PDF, imágenes, Office, texto o ZIP)." });
      continue;
    }
    ok.push(file);
    slot -= 1;
  }

  return { ok, rejected };
}

/** Content-Type coherente para Supabase (evita octet-stream cuando conocemos la extensión). */
export function resolveDiagnosticoUploadContentType(file: File): string {
  const ext = getDiagnosticoFileExtension(file.name);
  const fromExt = EXT_TO_MIME[ext];
  if (fromExt) return fromExt;
  const t = (file.type || "").trim();
  if (t && !t.startsWith(VIDEO_MIME_PREFIX)) return t;
  return "application/octet-stream";
}
