import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migrationsDir = join(process.cwd(), "supabase/migrations");

describe("Supabase migrations (schema as in previous project)", () => {
  it("defines onboarding_submissions table, RLS, and storage bucket", () => {
    const table = join(migrationsDir, "20260319195316_create_onboarding_submissions_table.sql");
    const rls = join(migrationsDir, "20260319210000_enable_rls_onboarding_submissions.sql");
    const storage = join(migrationsDir, "20260319220000_onboarding_attachments_bucket.sql");

    expect(existsSync(table)).toBe(true);
    expect(existsSync(rls)).toBe(true);
    expect(existsSync(storage)).toBe(true);

    const t = readFileSync(table, "utf8");
    expect(t).toContain("onboarding_submissions");
    expect(t).toContain("answers_raw");

    const r = readFileSync(rls, "utf8");
    expect(r).toContain("row level security");
    expect(r).toContain("onboarding_submissions_anon_insert");

    const s = readFileSync(storage, "utf8");
    expect(s).toContain("onboarding-attachments");
    expect(s).toContain("storage.objects");
  });
});
