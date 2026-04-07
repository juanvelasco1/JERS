export type SolutionFlowStep = { title: string; subtitle: string };

export type SolutionFlowData = {
  steps: SolutionFlowStep[];
  narrative: string;
};

export type AIDiagnosis = {
  summary: string;
  recommendations: { area: string; desc: string; priority: "Alta" | "Media" }[];
  nextSteps: string[];
  solutionFlow?: SolutionFlowData;
};

const DEFAULT_FLOW: SolutionFlowData = {
  steps: [
    { title: "Usuario", subtitle: "Cliente final" },
    { title: "Presencia", subtitle: "Web / Landing" },
    { title: "Interacción", subtitle: "Engagement" },
    { title: "Conversión", subtitle: "Crecimiento" },
  ],
  narrative:
    "Tu cliente descubre tu marca a través de tu presencia digital, interactúa con tus servicios o productos mediante canales de engagement, y finalmente se convierte en un cliente recurrente que impulsa tu crecimiento.",
};

export function buildFallbackSolutionFlow(
  recommendations: { area: string; desc?: string }[],
): SolutionFlowData {
  const r = recommendations.slice(0, 3);
  return {
    steps: [
      { title: "Descubrimiento", subtitle: "Tu audiencia te encuentra" },
      {
        title: r[0]?.area.slice(0, 18) || "Presencia digital",
        subtitle: "Primer contacto",
      },
      {
        title: r[1]?.area.slice(0, 18) || "Experiencia",
        subtitle: "Interacción",
      },
      { title: "Resultados", subtitle: "Valor y recurrencia" },
    ],
    narrative:
      recommendations.length > 0
        ? `El recorrido conecta el descubrimiento de tu marca con las áreas prioritarias (${r.map((x) => x.area).slice(0, 2).join(" · ")}) hasta convertir interacción en crecimiento medible.`
        : DEFAULT_FLOW.narrative,
  };
}

function normalizeSolutionFlow(raw: unknown): SolutionFlowData | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const stepsIn = Array.isArray(o.steps) ? o.steps : [];
  const steps: SolutionFlowStep[] = [];
  for (const s of stepsIn) {
    if (!s || typeof s !== "object") continue;
    const t = (s as Record<string, unknown>).title;
    const sub = (s as Record<string, unknown>).subtitle;
    if (typeof t === "string" && typeof sub === "string" && t.trim() && sub.trim()) {
      steps.push({
        title: t.trim().slice(0, 28),
        subtitle: sub.trim().slice(0, 36),
      });
    }
    if (steps.length >= 4) break;
  }
  let narrative =
    typeof o.narrative === "string" && o.narrative.trim()
      ? o.narrative.trim().slice(0, 420)
      : "";
  if (steps.length < 4) {
    while (steps.length < 4) {
      steps.push(DEFAULT_FLOW.steps[steps.length] ?? DEFAULT_FLOW.steps[3]);
    }
  }
  if (!narrative) narrative = DEFAULT_FLOW.narrative;
  return { steps: steps.slice(0, 4), narrative };
}

export function parseDiagnosisJson(raw: string): AIDiagnosis | null {
  const cleaned = raw.trim().replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  const candidate = jsonMatch ? jsonMatch[0] : cleaned;

  try {
    const parsed = JSON.parse(candidate) as Partial<AIDiagnosis> & {
      solutionFlow?: unknown;
    };
    if (!parsed.summary || !Array.isArray(parsed.recommendations) || !Array.isArray(parsed.nextSteps)) return null;

    const recommendations: AIDiagnosis["recommendations"] = parsed.recommendations
      .filter((r) => r && typeof r.area === "string" && typeof r.desc === "string")
      .slice(0, 4)
      .map((r) => ({
        area: r.area,
        desc: r.desc,
        priority: r.priority === "Alta" ? "Alta" : "Media",
      }));

    const nextSteps = parsed.nextSteps
      .filter((stepText): stepText is string => typeof stepText === "string" && stepText.trim().length > 0)
      .slice(0, 3);

    if (!recommendations.length || !nextSteps.length) return null;

    let summary = String(parsed.summary).trim();
    if (summary.length > 550) summary = `${summary.slice(0, 547)}…`;

    const solutionFlow = normalizeSolutionFlow(parsed.solutionFlow);

    return {
      summary,
      recommendations,
      nextSteps,
      ...(solutionFlow ? { solutionFlow } : {}),
    };
  } catch {
    return null;
  }
}

export function buildDiagnosisUserPrompt(
  lines: string[],
): string {
  return `${lines.join("\n")}

Responde SOLO con JSON válido (sin markdown), con esta forma exacta:
{
  "summary": "string (máximo ~450 caracteres, 2–3 frases)",
  "recommendations": [
    { "area": "string", "desc": "string (breve)", "priority": "Alta|Media" }
  ],
  "nextSteps": ["string", "string", "string"],
  "solutionFlow": {
    "steps": [
      { "title": "string (máx ~24 caracteres)", "subtitle": "string (máx ~32 caracteres)" }
    ],
    "narrative": "string (un solo párrafo, máximo ~380 caracteres; conecta el flujo con el caso y las recomendaciones)"
  }
}

Reglas:
- Tono claro, profesional y cercano.
- 3 a 4 recomendaciones máximo.
- "nextSteps" exactamente 3 elementos, accionables.
- "solutionFlow.steps" exactamente 4 pasos en orden lógico (ej. audiencia → presencia → interacción → valor/crecimiento), alineados con las recomendaciones y el sector del cliente.
- Los títulos de los pasos deben reflejar ideas concretas del diagnóstico, no texto genérico vacío.
- No inventes datos no provistos.`;
}

export async function fetchGeminiDiagnosis(prompt: string, apiKey: string): Promise<AIDiagnosis> {
  const model = "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.65,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini HTTP ${response.status}: ${errText}`);
  }

  const json = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    error?: { message?: string };
  };

  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error(json?.error?.message || "Gemini response did not include text.");

  const parsed = parseDiagnosisJson(text);
  if (!parsed) throw new Error("Gemini JSON format invalid.");
  return parsed;
}

export async function fetchOpenAIDiagnosis(prompt: string, apiKey: string): Promise<AIDiagnosis> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres un consultor digital. Devuelve solo JSON válido." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1200,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI HTTP ${response.status}: ${errorText}`);
  }

  const json = await response.json();
  const text = json?.choices?.[0]?.message?.content as string | undefined;
  if (!text) throw new Error("OpenAI response did not include text.");

  const parsed = parseDiagnosisJson(text);
  if (!parsed) throw new Error("OpenAI JSON format invalid.");
  return parsed;
}
