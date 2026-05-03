import { describe, expect, it } from "vitest";
import { buildFallbackSolutionFlow, parseDiagnosisJson, parseStoredAIDiagnosis } from "./diagnosisAi";

describe("diagnosisAi", () => {
  it("parses Gemini/OpenAI JSON including solutionFlow", () => {
    const raw = JSON.stringify({
      summary: "Resumen breve del caso.",
      recommendations: [
        { area: "Web", desc: "Desc", priority: "Alta" },
        { area: "SEO", desc: "Desc2", priority: "Media" },
      ],
      nextSteps: ["Uno", "Dos", "Tres"],
      solutionFlow: {
        steps: [
          { title: "A", subtitle: "a" },
          { title: "B", subtitle: "b" },
          { title: "C", subtitle: "c" },
          { title: "D", subtitle: "d" },
        ],
        narrative: "Texto del flujo que conecta recomendaciones.",
      },
      sugerencia_consultoria: "Priorizar landing con CTA claro antes de invertir en ads.",
    });

    const parsed = parseDiagnosisJson(raw);
    expect(parsed).not.toBeNull();
    expect(parsed?.solutionFlow?.steps).toHaveLength(4);
    expect(parsed?.solutionFlow?.narrative).toContain("recomendaciones");
    expect(parsed?.sugerenciaConsultoria).toContain("landing");
  });

  it("parseStoredAIDiagnosis accepts object from jsonb", () => {
    const obj = {
      summary: "Resumen.",
      recommendations: [
        { area: "Web", desc: "Desc", priority: "Alta" },
        { area: "SEO", desc: "Desc2", priority: "Media" },
      ],
      nextSteps: ["Uno", "Dos", "Tres"],
      source: "groq" as const,
    };
    const parsed = parseStoredAIDiagnosis(obj);
    expect(parsed).not.toBeNull();
    expect(parsed?.source).toBe("groq");
  });

  it("buildFallbackSolutionFlow uses recommendation areas", () => {
    const f = buildFallbackSolutionFlow([{ area: "E-commerce", desc: "x" }]);
    expect(f.steps).toHaveLength(4);
    expect(f.narrative).toContain("E-commerce");
  });
});
