import { describe, expect, it } from "vitest";
import { buildDiagnosticoClienteObjectPath } from "./diagnosticoStorage";

describe("diagnosticoStorage", () => {
  it("agrupa rutas bajo el id de la fila que sube (submission) y carpeta uploads", () => {
    const id = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
    const path = buildDiagnosticoClienteObjectPath(id, "brief.pdf", 1_700_000_000_000);
    expect(path).toBe(`${id}/uploads/1700000000000-brief.pdf`);
    expect(path.startsWith(`${id}/`)).toBe(true);
  });
});
