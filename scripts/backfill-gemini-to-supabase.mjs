import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const envPath = path.join(projectRoot, ".env");

function loadEnv(filePath) {
  const result = {};
  if (!fs.existsSync(filePath)) return result;
  const raw = fs.readFileSync(filePath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    result[key] = value;
  }
  return result;
}

function getIndustriaLabel(val) {
  const map = { comercio: "Comercio", servicios: "Servicios", salud: "Salud", educacion: "Educación", otro: "Otro" };
  return map[val] || val || "No especificado";
}

function getInvestmentLabel(val) {
  if (val === "inicial") return "Menos de $5,000";
  if (val === "profesional") return "$5,000 — $20,000";
  if (val === "avanzado") return "Más de $20,000";
  return "Por definir";
}

function parseAiJson(raw) {
  const cleaned = String(raw || "").trim().replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  const candidate = jsonMatch ? jsonMatch[0] : cleaned;
  const parsed = JSON.parse(candidate);
  if (!parsed.summary || !Array.isArray(parsed.recommendations) || !Array.isArray(parsed.nextSteps)) {
    throw new Error("Invalid AI JSON shape");
  }
  return {
    summary: parsed.summary,
    recommendations: parsed.recommendations
      .filter((r) => r && typeof r.area === "string" && typeof r.desc === "string")
      .slice(0, 4)
      .map((r) => ({
        area: r.area,
        desc: r.desc,
        priority: r.priority === "Alta" ? "Alta" : "Media",
      })),
    nextSteps: parsed.nextSteps
      .filter((s) => typeof s === "string" && s.trim().length > 0)
      .slice(0, 3),
  };
}

async function generateDiagnosis(apiKey, row) {
  const answersRaw = row.answers_raw || {};
  const retosSeleccionados = typeof answersRaw.problema === "string" ? answersRaw.problema : row.problema || "No especificado";

  const prompt = `
Genera un diagnóstico para una consultora digital en español.
Responde SOLO con JSON válido, sin markdown, con esta forma exacta:
{
  "summary": "string",
  "recommendations": [
    { "area": "string", "desc": "string", "priority": "Alta|Media" }
  ],
  "nextSteps": ["string", "string", "string"]
}

Reglas:
- Tono claro, profesional y cercano.
- 3 a 4 recomendaciones máximo.
- "nextSteps" exactamente 3 elementos, accionables.
- No inventes datos no provistos.

Datos del cliente:
- Empresa: ${row.empresa || "No especificado"}
- Industria: ${getIndustriaLabel(row.industria)}
- Tamaño: ${row.tamano || answersRaw["tamaño"] || "No especificado"}
- Problema: ${row.problema || "No especificado"}
- Presupuesto: ${getInvestmentLabel(row.presupuesto || "")}
- Retos seleccionados: ${retosSeleccionados}
`.trim();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
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
      max_tokens: 800,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI HTTP ${res.status}: ${txt}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("OpenAI returned empty text");
  return parseAiJson(text);
}

async function run() {
  const env = loadEnv(envPath);
  const projectId = env.PROJECT_ID || env.VITE_PROJECT_ID;
  const supabaseUrl = env.VITE_SUPABASE_URL || (projectId ? `https://${projectId}.supabase.co` : "");
  const supabaseKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY || env.API_KEY;
  const openaiApiKey = env.VITE_OPENAI_API_KEY || env.OPENAI_API_KEY;

  if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase env vars");
  if (!openaiApiKey) throw new Error("Missing OPENAI API key env var");

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const { data: rows, error } = await supabase
    .from("onboarding_submissions")
    .select("id, empresa, industria, tamano, problema, presupuesto, answers_raw, completed_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw error;

  const pending = (rows || []).filter((r) => !(r.answers_raw && r.answers_raw.ai_diagnosis));
  if (!pending.length) {
    console.log("No rows need AI backfill. All good.");
    return;
  }

  let updated = 0;
  for (const row of pending) {
    try {
      const aiDiagnosis = await generateDiagnosis(openaiApiKey, row);
      const nextAnswersRaw = { ...(row.answers_raw || {}), ai_diagnosis: aiDiagnosis };
      const { error: updateError } = await supabase
        .from("onboarding_submissions")
        .update({ answers_raw: nextAnswersRaw })
        .eq("id", row.id);
      if (updateError) throw updateError;
      updated++;
      console.log(`Updated ${row.id} (${row.empresa || "sin empresa"})`);
    } catch (e) {
      console.error(`Failed row ${row.id}:`, e.message || e);
    }
  }

  console.log(`Backfill complete. Updated ${updated}/${pending.length} rows.`);
}

run().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
