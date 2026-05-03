/// <reference types="vite/client" />
import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { Loader2 } from "lucide-react";
import { tryClaimPendingSubmissionFromStorage } from "@/app/lib/diagnosticClaimStorage";
import { getSupabaseBrowser } from "@/app/lib/supabaseBrowser";
import { useSupabaseSession } from "@/app/hooks/useSupabaseSession";

const DEFAULT_NEXT = "/mi-proyecto";

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = useMemo(() => {
    const raw = searchParams.get("next")?.trim();
    if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return DEFAULT_NEXT;
    return raw;
  }, [searchParams]);

  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const { user, loading: sessionLoading } = useSupabaseSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!supabase) {
      setError("Falta configurar Supabase (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY).");
      return;
    }
    const eTrim = email.trim().toLowerCase();
    if (!eTrim) {
      setError("Escribe el correo con el que te registraste.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setBusy(true);
    try {
      const { error: signErr } = await supabase.auth.signInWithPassword({ email: eTrim, password });
      if (signErr) {
        setError(signErr.message);
        return;
      }
      await tryClaimPendingSubmissionFromStorage(supabase);
      navigate(next, { replace: true });
    } finally {
      setBusy(false);
    }
  };

  const handleGuest = async () => {
    setError(null);
    if (!supabase) {
      setError("Falta configurar Supabase (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY).");
      return;
    }
    setBusy(true);
    try {
      const { error: anonErr } = await supabase.auth.signInAnonymously();
      if (anonErr) {
        setError(
          anonErr.message.includes("Anonymous") || /anonymous/i.test(anonErr.message)
            ? "Activa “Anonymous sign-ins” en Supabase (Authentication → Providers → Anonymous)."
            : anonErr.message,
        );
        return;
      }
      await tryClaimPendingSubmissionFromStorage(supabase);
      navigate(next, { replace: true });
    } finally {
      setBusy(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="flex items-center gap-2 text-[13px] text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" aria-hidden />
          Cargando…
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={next} replace />;
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-lg text-gray-900 mb-1" style={{ fontWeight: 700 }}>
          Iniciar sesión
        </h1>
        <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
          Accede a tu resumen de proyecto y al diagnóstico vinculado a tu cuenta. También puedes entrar como invitado
          (sin correo): la sesión queda en este navegador.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-[12px] text-gray-600 mb-1" style={{ fontWeight: 600 }}>
              Correo
            </label>
            <input
              id="login-email"
              type="text"
              autoComplete="username"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-white px-3 py-2.5 text-[14px] text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-[12px] text-gray-600 mb-1" style={{ fontWeight: 600 }}>
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-white px-3 py-2.5 text-[14px] text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
            />
          </div>

          {error && <p className="text-[12px] text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] py-2.5 text-[14px] text-white transition-opacity hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            style={{ fontWeight: 600 }}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden /> : null}
            Entrar
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-gray-100" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wide text-gray-400" style={{ fontWeight: 600 }}>
            <span className="bg-white px-3">o</span>
          </div>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => void handleGuest()}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-[14px] text-gray-800 transition-colors hover:bg-gray-50 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          style={{ fontWeight: 600 }}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden /> : null}
          Entrar como invitado (sin correo)
        </button>

        <p className="mt-6 text-center text-[12px] text-gray-500 leading-relaxed">
          ¿Aún sin cuenta?{" "}
          <Link to="/?diagnostico=true" className="text-blue-600 hover:text-blue-700" style={{ fontWeight: 600 }}>
            Haz el diagnóstico
          </Link>{" "}
          y regístrate al final para vincularlo.
        </p>
      </div>
    </div>
  );
}
