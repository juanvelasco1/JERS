import { describe, expect, it } from "vitest";
import {
  CONTEXTO_ACTUAL_VALUES,
  isValidContextoActual,
  sanitizeStorageFileName,
} from "./onboardingContexto";

describe("onboardingContexto", () => {
  it("validates contexto option values", () => {
    expect(CONTEXTO_ACTUAL_VALUES).toHaveLength(3);
    expect(isValidContextoActual("ya_tengo")).toBe(true);
    expect(isValidContextoActual("idea")).toBe(true);
    expect(isValidContextoActual("cero")).toBe(true);
    expect(isValidContextoActual("")).toBe(false);
    expect(isValidContextoActual(undefined)).toBe(false);
    expect(isValidContextoActual("otro")).toBe(false);
  });

  it("sanitizes file names for storage paths", () => {
    expect(sanitizeStorageFileName("mi diseño (v2).pdf")).toBe("mi_dise_o__v2_.pdf");
    expect(sanitizeStorageFileName("../../etc/passwd")).toBe("passwd");
  });
});
