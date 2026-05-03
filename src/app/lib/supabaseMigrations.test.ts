import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Avoid relying on `process.cwd()` since other tests or runners may `chdir`,
 * which can make these filesystem assertions unexpectedly slow or flaky.
 */
const here = dirname(fileURLToPath(import.meta.url));
function findRepoRoot(startDir: string): string {
  // Walk up until we find package.json (repo root in this project)
  let dir = resolve(startDir);
  for (let i = 0; i < 12; i++) {
    if (existsSync(join(dir, "package.json"))) return dir;
    const parent = resolve(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }
  return resolve(startDir, "../../../..");
}

const repoRoot = findRepoRoot(here);
const migrationsDir = join(repoRoot, "supabase/migrations");

describe("Supabase migrations (schema as in previous project)", () => {
  it(
    "defines onboarding_submissions table, RLS, and storage bucket",
    { timeout: 60_000 },
    () => {
    const table = join(migrationsDir, "20260319195316_create_onboarding_submissions_table.sql");
    const rls = join(migrationsDir, "20260319210000_enable_rls_onboarding_submissions.sql");
    const storageLegacy = join(migrationsDir, "20260319220000_onboarding_attachments_bucket.sql");
    const storageClientes = join(migrationsDir, "20260422120000_diagnostico_clientes_storage.sql");
    const storageMimes = join(migrationsDir, "20260422150000_diagnostico_clientes_allowed_mimes.sql");
    const userLink = join(migrationsDir, "20260503120000_onboarding_submissions_user_link.sql");
    const authInsertOwner = join(migrationsDir, "20260504120000_onboarding_auth_insert_owner_and_claim_noop.sql");

    expect(existsSync(table)).toBe(true);
    expect(existsSync(rls)).toBe(true);
    expect(existsSync(storageLegacy)).toBe(true);
    expect(existsSync(storageClientes)).toBe(true);
    expect(existsSync(storageMimes)).toBe(true);
    expect(existsSync(userLink)).toBe(true);
    expect(existsSync(authInsertOwner)).toBe(true);

    const t = readFileSync(table, "utf8");
    expect(t).toContain("onboarding_submissions");
    expect(t).toContain("answers_raw");

    const r = readFileSync(rls, "utf8");
    expect(r).toContain("row level security");
    expect(r).toContain("onboarding_submissions_anon_insert");

    const sLegacy = readFileSync(storageLegacy, "utf8");
    expect(sLegacy).toContain("onboarding-attachments");
    expect(sLegacy).toContain("storage.objects");

    const sClientes = readFileSync(storageClientes, "utf8");
    expect(sClientes).toContain("diagnostico-clientes");
    expect(sClientes).toContain("onboarding_submissions");
    expect(sClientes).toContain("storage.foldername(name)");

    const sMimes = readFileSync(storageMimes, "utf8");
    expect(sMimes).toContain("allowed_mime_types");
    expect(sMimes).toContain("application/pdf");
    expect(sMimes).not.toMatch(/video\//);

    const u = readFileSync(userLink, "utf8");
    expect(u).toContain("user_id");
    expect(u).toContain("claim_onboarding_submission");
    expect(u).toContain("onboarding_submissions_anon_update");

    const a = readFileSync(authInsertOwner, "utf8");
    expect(a).toContain("user_id = auth.uid()");
    expect(a).toContain("claim_onboarding_submission");
    },
  );
});
