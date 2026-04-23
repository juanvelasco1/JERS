import { describe, expect, it } from "vitest";
import {
  DIAGNOSTICO_ARCHIVOS_MAX_COUNT,
  getDiagnosticoFileExtension,
  isDiagnosticoArchivoPermitido,
  isVideoDiagnosticoFile,
  partitionDiagnosticoArchivos,
  resolveDiagnosticoUploadContentType,
} from "./diagnosticoArchivos";

describe("diagnosticoArchivos", () => {
  it("rechaza vídeo por MIME o por extensión", () => {
    expect(isVideoDiagnosticoFile(new File([], "clip.mp4", { type: "video/mp4" }))).toBe(true);
    expect(isVideoDiagnosticoFile(new File([], "clip.mov", { type: "" }))).toBe(true);
    expect(isVideoDiagnosticoFile(new File([], "clip.MOV", { type: "application/octet-stream" }))).toBe(true);
    expect(isDiagnosticoArchivoPermitido(new File([], "clip.mp4", { type: "video/mp4" }))).toBe(false);
  });

  it("acepta PDF, imágenes, docx y varios a la vez", () => {
    const batch = [
      new File(["%PDF"], "a.pdf", { type: "application/pdf" }),
      new File([new Uint8Array([0xff, 0xd8, 0xff])], "b.jpg", { type: "image/jpeg" }),
      new File(["PK"], "c.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
      new File(["x"], "d.png", { type: "image/png" }),
    ];
    const { ok, rejected } = partitionDiagnosticoArchivos(batch);
    expect(rejected).toHaveLength(0);
    expect(ok).toHaveLength(4);
  });

  it("mezcla válidos e inválidos: conserva solo los permitidos", () => {
    const { ok, rejected } = partitionDiagnosticoArchivos([
      new File([], "ok.pdf", { type: "application/pdf" }),
      new File([], "bad.mp4", { type: "video/mp4" }),
      new File([], "ok2.txt", { type: "text/plain" }),
    ]);
    expect(ok.map((f) => f.name)).toEqual(["ok.pdf", "ok2.txt"]);
    expect(rejected).toHaveLength(1);
    expect(rejected[0].file.name).toBe("bad.mp4");
    expect(rejected[0].reason).toMatch(/vídeo/i);
  });

  it("rechaza por tamaño y respeta el máximo de archivos", () => {
    const big = new File([new Uint8Array(20)], "big.pdf", { type: "application/pdf" });
    const { rejected: r1 } = partitionDiagnosticoArchivos([big], { maxBytesPerFile: 10 });
    expect(r1[0].reason).toMatch(/bytes|MB/);

    const files = Array.from({ length: DIAGNOSTICO_ARCHIVOS_MAX_COUNT + 2 }, (_, i) =>
      new File(["%PDF"], `f${i}.pdf`, { type: "application/pdf" }),
    );
    const { ok, rejected } = partitionDiagnosticoArchivos(files, { existingCount: 0 });
    expect(ok.length).toBe(DIAGNOSTICO_ARCHIVOS_MAX_COUNT);
    expect(rejected.length).toBe(2);
    expect(rejected.every((r) => r.reason.includes("Máximo"))).toBe(true);
  });

  it("respeta cupo frente a archivos ya seleccionados", () => {
    const incoming = Array.from({ length: 5 }, (_, i) => new File(["%PDF"], `n${i}.pdf`, { type: "application/pdf" }));
    const { ok, rejected } = partitionDiagnosticoArchivos(incoming, {
      existingCount: DIAGNOSTICO_ARCHIVOS_MAX_COUNT - 2,
    });
    expect(ok).toHaveLength(2);
    expect(rejected).toHaveLength(3);
  });

  it("getDiagnosticoFileExtension y content type por extensión", () => {
    expect(getDiagnosticoFileExtension("ruta/sub/cosa.DOCX")).toBe("docx");
    expect(resolveDiagnosticoUploadContentType(new File([], "x.docx", { type: "" }))).toBe(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    expect(resolveDiagnosticoUploadContentType(new File([], "x.jpg", { type: "" }))).toBe("image/jpeg");
  });
});
