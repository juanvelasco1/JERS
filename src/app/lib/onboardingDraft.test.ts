import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ONBOARDING_DRAFT_STORAGE_KEY,
  clearOnboardingDraftStorage,
  clampStepIndex,
  readOnboardingDraft,
} from "./onboardingDraft";

const TOTAL_STEPS = 7;

function installMemoryLocalStorage() {
  let store: Record<string, string> = {};
  const ls = {
    getItem: (key: string) => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
  vi.stubGlobal("localStorage", ls);
  return ls;
}

describe("onboardingDraft (localStorage restore simulates page reload)", () => {
  beforeEach(() => {
    installMemoryLocalStorage();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("restores the same answers and step after a simulated reload (second read)", () => {
    const saved = {
      v: 1 as const,
      currentStep: 3,
      data: { empresa: "Mi negocio", industria: "comercio" },
      selectedPrompts: ["No tengo presencia en internet"],
      extraDetail: "Necesito web",
      otroText: "",
      phase: "form" as const,
      aiDiagnosis: null,
      processingStep: 0,
      contextoArchivosMeta: [],
    };

    localStorage.setItem(ONBOARDING_DRAFT_STORAGE_KEY, JSON.stringify(saved));

    const afterFirstPaint = readOnboardingDraft();
    expect(afterFirstPaint).not.toBeNull();
    expect(afterFirstPaint!.currentStep).toBe(3);
    expect(afterFirstPaint!.data.empresa).toBe("Mi negocio");
    expect(afterFirstPaint!.selectedPrompts).toEqual(["No tengo presencia en internet"]);

    // Simula recarga: nueva lectura desde localStorage (como un nuevo mount del componente).
    const afterReload = readOnboardingDraft();
    expect(afterReload).toEqual(afterFirstPaint);
  });

  it("returns null after clearOnboardingDraftStorage", () => {
    localStorage.setItem(
      ONBOARDING_DRAFT_STORAGE_KEY,
      JSON.stringify({
        v: 1,
        currentStep: 1,
        data: {},
        selectedPrompts: [],
        extraDetail: "",
        otroText: "",
        phase: "form",
        aiDiagnosis: null,
        processingStep: 0,
        contextoArchivosMeta: [],
      }),
    );
    clearOnboardingDraftStorage();
    expect(readOnboardingDraft()).toBeNull();
  });

  it("returns null for invalid JSON", () => {
    localStorage.setItem(ONBOARDING_DRAFT_STORAGE_KEY, "not-json");
    expect(readOnboardingDraft()).toBeNull();
  });

  it("clamps step index to valid range", () => {
    expect(clampStepIndex(-1, TOTAL_STEPS)).toBe(0);
    expect(clampStepIndex(99, TOTAL_STEPS)).toBe(TOTAL_STEPS - 1);
    expect(clampStepIndex(2, TOTAL_STEPS)).toBe(2);
  });
});
