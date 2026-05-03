import { describe, expect, it } from "vitest";
import { getSimulatedPhases } from "./simulatedMiProyectoProgress";

describe("getSimulatedPhases", () => {
  it("first phase is always completed at 100%", () => {
    expect(getSimulatedPhases("a")[0].percent).toBe(100);
    expect(getSimulatedPhases("a")[0].status).toBe("completado");
  });

  it("is stable for the same seed", () => {
    expect(getSimulatedPhases("uuid-123")).toEqual(getSimulatedPhases("uuid-123"));
  });

  it("returns five phases", () => {
    expect(getSimulatedPhases("x")).toHaveLength(5);
  });
});
