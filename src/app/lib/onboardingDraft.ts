import type { AIDiagnosis } from "./diagnosisAi";
import type { ContextoArchivoMeta } from "./onboardingContexto";

export type OnboardingDraftV1 = {
  v: 1;
  currentStep: number;
  data: Record<string, string>;
  selectedPrompts: string[];
  extraDetail: string;
  otroText: string;
  phase: "form" | "results";
  aiDiagnosis: AIDiagnosis | null;
  processingStep: number;
  contextoArchivosMeta: ContextoArchivoMeta[];
};

export const ONBOARDING_DRAFT_STORAGE_KEY = "onboarding_draft_v1";

export function readOnboardingDraft(): OnboardingDraftV1 | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OnboardingDraftV1> | null;
    if (!parsed || parsed.v !== 1) return null;
    return {
      v: 1,
      currentStep: Number.isFinite(parsed.currentStep) ? Number(parsed.currentStep) : 0,
      data: parsed.data && typeof parsed.data === "object" ? parsed.data : {},
      selectedPrompts: Array.isArray(parsed.selectedPrompts)
        ? parsed.selectedPrompts.filter((v) => typeof v === "string")
        : [],
      extraDetail: typeof parsed.extraDetail === "string" ? parsed.extraDetail : "",
      otroText: typeof parsed.otroText === "string" ? parsed.otroText : "",
      phase: parsed.phase === "results" ? "results" : "form",
      aiDiagnosis: parsed.aiDiagnosis ?? null,
      processingStep: Number.isFinite(parsed.processingStep) ? Number(parsed.processingStep) : 0,
      contextoArchivosMeta: Array.isArray(parsed.contextoArchivosMeta) ? parsed.contextoArchivosMeta : [],
    };
  } catch {
    return null;
  }
}

export function clearOnboardingDraftStorage(): void {
  try {
    localStorage.removeItem(ONBOARDING_DRAFT_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}

export function clampStepIndex(step: number, total: number): number {
  if (!Number.isFinite(step)) return 0;
  if (step < 0) return 0;
  if (step >= total) return total - 1;
  return step;
}
