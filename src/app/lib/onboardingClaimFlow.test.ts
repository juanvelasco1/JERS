import { describe, expect, it } from "vitest";
import { resolveSubmissionIdForClaim } from "./onboardingClaimFlow";

describe("onboardingClaimFlow", () => {
  it("prefers ref id when both exist", () => {
    expect(resolveSubmissionIdForClaim("aaa", "bbb")).toBe("aaa");
  });

  it("uses persist id when ref was null (INSERT path)", () => {
    expect(resolveSubmissionIdForClaim(null, "new-row-uuid")).toBe("new-row-uuid");
  });

  it("returns null when neither is set", () => {
    expect(resolveSubmissionIdForClaim(null, null)).toBeNull();
  });
});
