/**
 * Verifies Supabase: table CRUD (anon), JSON answers_raw, and Storage upload.
 * Requires .env: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
 * Optional: VITE_SUPABASE_SERVICE_ROLE_KEY or API_KEY for cleanup (delete row + file).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const envPath = path.join(projectRoot, ".env");

function loadEnv(filePath) {
  const result = {};
  if (!fs.existsSync(filePath)) return result;
  const raw = fs.readFileSync(filePath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    result[key] = value;
  }
  return result;
}

/** Supabase JWT (anon/service) contains `ref` — must match *.supabase.co host */
function refFromSupabaseJwt(jwt) {
  const parts = jwt.split(".");
  if (parts.length < 2) return null;
  try {
    const json = Buffer.from(parts[1], "base64url").toString("utf8");
    const payload = JSON.parse(json);
    return typeof payload.ref === "string" ? payload.ref : null;
  } catch {
    return null;
  }
}

function refFromSupabaseUrl(urlStr) {
  try {
    const h = new URL(urlStr).hostname;
    const m = h.match(/^([a-z0-9]+)\.supabase\.co$/i);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

function assertUrlMatchesAnonKey(urlStr, anonJwt) {
  const urlRef = refFromSupabaseUrl(urlStr);
  const jwtRef = refFromSupabaseJwt(anonJwt);
  if (!urlRef || !jwtRef) {
    console.warn("Could not parse project ref from URL or anon key; skipping ref check.");
    return;
  }
  if (urlRef !== jwtRef) {
    throw new Error(
      `VITE_SUPABASE_URL host (${urlRef}.supabase.co) does not match VITE_SUPABASE_ANON_KEY project ref (${jwtRef}). ` +
        "Use the anon key from the same project as the URL (Settings → API).",
    );
  }
}

async function run() {
  const env = loadEnv(envPath);
  const projectId = env.PROJECT_ID || env.VITE_PROJECT_ID;
  const url = env.VITE_SUPABASE_URL || (projectId ? `https://${projectId}.supabase.co` : "");
  const anonKey = env.VITE_SUPABASE_ANON_KEY?.trim();
  const serviceKey =
    (env.VITE_SUPABASE_SERVICE_ROLE_KEY || env.API_KEY || "").trim() || null;

  if (!url || !anonKey) {
    throw new Error("Missing VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY in .env");
  }

  assertUrlMatchesAnonKey(url, anonKey);

  const anon = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const runId = `verify-${Date.now()}`;
  const payload = {
    current_step: 6,
    completed_at: new Date().toISOString(),
    empresa: `QA verify ${runId}`,
    industria: "comercio",
    answers_raw: {
      test: true,
      problema: "verify script",
      contexto_actual: "idea",
      contexto_detalle: "detalle de prueba",
      contexto_archivos: [{ path: "test/path.txt", name: "note.txt", size: 4, url: "https://example.com/x" }],
    },
  };

  const insert = await anon.from("onboarding_submissions").insert(payload).select("id").single();
  if (insert.error) throw new Error(`insert: ${insert.error.message}`);

  const id = insert.data.id;
  console.log("insert ok:", id);

  const sel = await anon
    .from("onboarding_submissions")
    .select("id, empresa, answers_raw")
    .eq("id", id)
    .single();
  if (sel.error) throw new Error(`select: ${sel.error.message}`);
  if (sel.data.empresa !== payload.empresa) throw new Error("empresa mismatch");
  if (!sel.data.answers_raw?.test) throw new Error("answers_raw.test missing");

  const upd = await anon
    .from("onboarding_submissions")
    .update({ presupuesto: "profesional", answers_raw: { ...payload.answers_raw, updated: true } })
    .eq("id", id);
  if (upd.error) throw new Error(`update: ${upd.error.message}`);
  console.log("update ok");

  const tiny = new Blob([runId], { type: "text/plain" });
  const storagePath = `${id}/verify-${Date.now()}.txt`;
  const up = await anon.storage.from("onboarding-attachments").upload(storagePath, tiny, {
    contentType: "text/plain",
    upsert: false,
  });
  if (up.error) throw new Error(`storage upload: ${up.error.message}`);
  console.log("storage upload ok:", storagePath);

  if (serviceKey) {
    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    await admin.storage.from("onboarding-attachments").remove([storagePath]);
    const del = await admin.from("onboarding_submissions").delete().eq("id", id);
    if (del.error) throw new Error(`delete row: ${del.error.message}`);
    console.log("cleanup ok (service role): row + file removed");
  } else {
    console.log("skip cleanup: set VITE_SUPABASE_SERVICE_ROLE_KEY or API_KEY in .env to auto-delete test row");
  }

  console.log("\nOK: Supabase persistence test passed.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
