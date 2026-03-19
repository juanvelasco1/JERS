import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
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

async function run() {
  const env = loadEnv(envPath);
  const projectId = env.PROJECT_ID || env.VITE_PROJECT_ID;
  const supabaseUrl = env.VITE_SUPABASE_URL || (projectId ? `https://${projectId}.supabase.co` : "");
  const supabaseKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY || env.API_KEY;
  const appUrl = process.env.APP_URL || "http://127.0.0.1:5173";

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase URL/key in .env");
  }

  const artifactsDir = path.join(projectRoot, "e2e-artifacts");
  fs.mkdirSync(artifactsDir, { recursive: true });

  const runId = Date.now();
  const empresa = `QA Puppeteer ${runId}`;
  const problemaExtra = "Prueba automatizada E2E";

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(20000);
  const browserLogs = [];
  page.on("console", (msg) => {
    const text = `[console:${msg.type()}] ${msg.text()}`;
    browserLogs.push(text);
  });
  page.on("requestfailed", (req) => {
    const url = req.url();
    if (url.includes("supabase.co")) {
      browserLogs.push(`[requestfailed] ${url} -> ${req.failure()?.errorText || "unknown"}`);
    }
  });
  page.on("response", (res) => {
    const url = res.url();
    if (url.includes("supabase.co")) {
      browserLogs.push(`[response] ${res.status()} ${url}`);
    }
  });

  async function clickButtonByText(partialText) {
    const clicked = await page.$$eval("button", (buttons, text) => {
      const target = buttons.find((btn) => (btn.textContent || "").includes(text));
      if (!target) return false;
      target.click();
      return true;
    }, partialText);
    if (!clicked) throw new Error(`Button not found: ${partialText}`);
  }

  try {
    await page.goto(appUrl, { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(artifactsDir, "01-home.png"), fullPage: true });

    await clickButtonByText("Comienza tu diagnóstico");
    await page.waitForSelector("text/Paso 1 de 5");
    await page.screenshot({ path: path.join(artifactsDir, "02-step1.png"), fullPage: true });

    await page.type('input[placeholder*="Panadería"]', empresa);
    await clickButtonByText("Continuar");

    await page.waitForSelector("text/Paso 2 de 5");
    await clickButtonByText("Servicios");

    await page.waitForSelector("text/Paso 3 de 5");
    await clickButtonByText("2 — 10 personas");

    await page.waitForSelector("text/Paso 4 de 5");
    await clickButtonByText("Me cuesta conseguir clientes");
    await page.type("textarea", problemaExtra);
    await clickButtonByText("Continuar");

    await page.waitForSelector("text/Paso 5 de 5");
    await clickButtonByText("$5,000 — $20,000");

    await page.waitForSelector("text/Tu diagnóstico está listo", { timeout: 30000 });
    await page.screenshot({ path: path.join(artifactsDir, "03-results.png"), fullPage: true });

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });

    const { data, error } = await supabase
      .from("onboarding_submissions")
      .select("id, created_at, current_step, empresa, industria, tamano, problema, presupuesto, completed_at")
      .eq("empresa", empresa)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      fs.writeFileSync(path.join(artifactsDir, "browser-logs.txt"), browserLogs.join("\n"));
      throw new Error("No onboarding row found in Supabase for test company name.");
    }

    const summary = {
      ok: true,
      appUrl,
      empresa,
      row: data,
      screenshots: [
        "e2e-artifacts/01-home.png",
        "e2e-artifacts/02-step1.png",
        "e2e-artifacts/03-results.png",
      ],
    };

    fs.writeFileSync(path.join(artifactsDir, "puppeteer-result.json"), JSON.stringify(summary, null, 2));
    fs.writeFileSync(path.join(artifactsDir, "browser-logs.txt"), browserLogs.join("\n"));
    console.log(JSON.stringify(summary, null, 2));
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("E2E test failed:", err);
  process.exit(1);
});
