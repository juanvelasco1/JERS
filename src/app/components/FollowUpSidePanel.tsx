/// <reference types="vite/client" />
import { useCallback, useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Link } from "react-router";
import { Loader2 } from "lucide-react";
import { DIAGNOSTIC_CLAIM_READY_EVENT } from "@/app/lib/diagnosticClaimEvents";
import { ONBOARDING_CLAIM_SUBMISSION_STORAGE_KEY } from "@/app/lib/diagnosticClaimStorage";
import { getSupabaseBrowser } from "@/app/lib/supabaseBrowser";

export function FollowUpSidePanel(props: { onDismiss: () => void }) {
  const { onDismiss } = props;

  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const [step, setStep] = useState<"choice" | "register">("choice");
  const [submissionId, setSubmissionId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ONBOARDING_CLAIM_SUBMISSION_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [accountLinked, setAccountLinked] = useState(false);
  const [pendingEmailConfirm, setPendingEmailConfirm] = useState(false);

  const refreshClaimId = useCallback(() => {
    try {
      const v = localStorage.getItem(ONBOARDING_CLAIM_SUBMISSION_STORAGE_KEY);
      setSubmissionId((prev) => (prev === v ? prev : v));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    refreshClaimId();
    const onReady = () => refreshClaimId();
    window.addEventListener(DIAGNOSTIC_CLAIM_READY_EVENT, onReady);
    const onStorage = (e: StorageEvent) => {
      if (e.key === ONBOARDING_CLAIM_SUBMISSION_STORAGE_KEY) refreshClaimId();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(DIAGNOSTIC_CLAIM_READY_EVENT, onReady);
      window.removeEventListener("storage", onStorage);
    };
  }, [refreshClaimId]);

  const tryClaim = useCallback(async (client: SupabaseClient, id: string) => {
    const { data: ok, error: rpcError } = await client.rpc("claim_onboarding_submission", { p_submission: id });
    if (rpcError) {
      console.warn("claim_onboarding_submission:", rpcError);
      return false;
    }
    if (ok === true) {
      try {
        localStorage.removeItem(ONBOARDING_CLAIM_SUBMISSION_STORAGE_KEY);
      } catch {
        // ignore
      }
      setSubmissionId(null);
      setAccountLinked(true);
      setPendingEmailConfirm(false);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" || !session?.user) return;
      let claimId: string | null = null;
      try {
        claimId = localStorage.getItem(ONBOARDING_CLAIM_SUBMISSION_STORAGE_KEY);
      } catch {
        return;
      }
      if (!claimId) return;
      void tryClaim(supabase, claimId);
    });
    return () => subscription.unsubscribe();
  }, [supabase, tryClaim]);

  useEffect(() => {
    if (!supabase || !submissionId) return;
    void (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;
      await tryClaim(supabase, submissionId);
    })();
  }, [supabase, submissionId, tryClaim]);

  const handleRegister = async () => {
    setError(null);
    if (!supabase) {
      setError("Supabase no está configurado en el proyecto.");
      return;
    }
    if (!submissionId) {
      setError("No encontramos un diagnóstico pendiente por vincular.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    const e = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      setError("Introduce un correo válido.");
      return;
    }

    setBusy(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email: e, password });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (data.session) {
        const ok = await tryClaim(supabase, submissionId);
        if (!ok) {
          setError("Cuenta creada, pero no pudimos vincular este diagnóstico automáticamente.");
          return;
        }
        setEmail("");
        setPassword("");
        setPasswordConfirm("");
      } else {
        setPendingEmailConfirm(true);
      }
    } finally {
      setBusy(false);
    }
  };

  // If supabase isn't configured or there's nothing to claim, don't render.
  if (!supabase || (!submissionId && !accountLinked && !pendingEmailConfirm)) return null;

  return (
    <div className="w-[320px] shrink-0">
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-white">
          <p className="text-[10px] text-blue-600 mb-1" style={{ fontWeight: 600, letterSpacing: "0.10em" }}>
            SIGUIENTE PASO
          </p>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[13px] text-blue-950 leading-snug" style={{ fontWeight: 800 }}>
              Guardar tu diagnóstico
            </h3>
            <button
              type="button"
              onClick={onDismiss}
              className="text-[11px] text-blue-600 hover:text-blue-700 transition-colors shrink-0"
              style={{ fontWeight: 600 }}
            >
              Cerrar
            </button>
          </div>
          <p className="mt-1 text-[12px] text-blue-900/75 leading-relaxed">
            Regístrate para que este diagnóstico quede enlazado a tu usuario.
          </p>
        </div>

        <div className="p-4 bg-white">
          {step === "choice" && !accountLinked && !pendingEmailConfirm && (
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setStep("register")}
                className="w-full rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 py-2.5 text-[13px] text-white transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-md hover:shadow-blue-600/25"
                style={{ fontWeight: 700 }}
              >
                Registrarme
              </button>
              <button
                type="button"
                onClick={onDismiss}
                className="w-full rounded-xl border border-gray-100 bg-white py-2.5 text-[13px] text-blue-800 transition-colors hover:bg-gray-50"
                style={{ fontWeight: 600 }}
              >
                No por ahora
              </button>
            </div>
          )}

          {accountLinked && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[12px] text-emerald-950 leading-relaxed space-y-2">
              <p>Listo: tu diagnóstico quedó vinculado a tu cuenta.</p>
              <Link
                to="/mi-proyecto"
                className="inline-flex w-full justify-center rounded-lg bg-emerald-700 px-3 py-2 text-[12px] text-white hover:bg-emerald-800 transition-colors"
                style={{ fontWeight: 600 }}
              >
                Ver resumen de mi proyecto
              </Link>
            </div>
          )}

          {pendingEmailConfirm && !accountLinked && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12px] text-amber-950 leading-relaxed">
              Revisa tu correo para confirmar la cuenta. Al iniciar sesión, vincularemos este diagnóstico automáticamente.
            </div>
          )}

          {step === "register" && !accountLinked && !pendingEmailConfirm && (
            <form
              className="space-y-2.5"
              onSubmit={(e) => {
                e.preventDefault();
                void handleRegister();
              }}
            >
              <div>
                <label htmlFor="side-register-email" className="block text-[11px] text-blue-800 mb-1" style={{ fontWeight: 700 }}>
                  Correo
                </label>
                <input
                  id="side-register-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-100 bg-white px-3 py-2 text-[13px] text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                  placeholder="tu@correo.com"
                />
              </div>
              <div>
                <label htmlFor="side-register-password" className="block text-[11px] text-blue-800 mb-1" style={{ fontWeight: 700 }}>
                  Contraseña
                </label>
                <input
                  id="side-register-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-100 bg-white px-3 py-2 text-[13px] text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label htmlFor="side-register-password2" className="block text-[11px] text-blue-800 mb-1" style={{ fontWeight: 700 }}>
                  Confirmar
                </label>
                <input
                  id="side-register-password2"
                  type="password"
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full rounded-xl border border-gray-100 bg-white px-3 py-2 text-[13px] text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                />
              </div>

              {error && (
                <p className="text-[12px] text-red-600" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 py-2.5 text-[13px] text-white transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-md hover:shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none flex items-center justify-center gap-2"
                style={{ fontWeight: 700 }}
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Creando…
                  </>
                ) : (
                  "Crear cuenta"
                )}
              </button>
              <button
                type="button"
                onClick={() => setStep("choice")}
                className="w-full rounded-xl border border-gray-100 bg-white py-2.5 text-[13px] text-blue-800 transition-colors hover:bg-gray-50"
                style={{ fontWeight: 600 }}
              >
                Volver
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

