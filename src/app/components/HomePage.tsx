import { Link, useSearchParams } from "react-router";
import { lazy, Suspense, useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import { ProcessAnimation } from "./ProcessAnimation";
import { FollowUpSidePanel } from "./FollowUpSidePanel";

const Onboarding = lazy(() =>
  import("./Onboarding").then((m) => ({ default: m.Onboarding })),
);

/** Si React Router remonta la home, recuperamos el modal del diagnóstico en la misma pestaña. */
const DIAG_UI_SESSION_KEY = "jers_diag_ui_open_v1";

/* ── Doodle decorator ── */
function Doodle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className={`absolute pointer-events-none select-none ${className}`}
    >
      {children}
    </motion.div>
  );

}
 
export function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return sessionStorage.getItem(DIAG_UI_SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [dismissFollowUp, setDismissFollowUp] = useState(false);
  /** Tamaño del shell: fijo en formulario/procesando; se relaja solo en resultados. */
  const [onboardingShell, setOnboardingShell] = useState<"flow" | "results">("flow");
  const [searchParams, setSearchParams] = useSearchParams();
  /** Primitivo estable: el objeto `searchParams` cambia de referencia en cada render y rompe el efecto. */
  const searchKey = searchParams.toString();
  /** Solo consumimos `?diagnostico=true` una vez por cada aparición en la URL. */
  const diagnosticoHandledRef = useRef(false);

  const setDiagnosticoModalOpen = useCallback((open: boolean) => {
    setShowOnboarding(open);
    try {
      if (open) sessionStorage.setItem(DIAG_UI_SESSION_KEY, "1");
      else sessionStorage.removeItem(DIAG_UI_SESSION_KEY);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchKey);
    if (params.get("diagnostico") !== "true") {
      diagnosticoHandledRef.current = false;
      return;
    }
    if (diagnosticoHandledRef.current) return;
    diagnosticoHandledRef.current = true;
    setDiagnosticoModalOpen(true);
    // Solo tocar el query string (SPA). `navigate()` a la misma ruta puede remontar según versión y parecer “recarga”.
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("diagnostico");
        return next;
      },
      { replace: true },
    );
  }, [searchKey, setSearchParams, setDiagnosticoModalOpen]);

  useEffect(() => {
    if (!showOnboarding) {
      setDismissFollowUp(false);
      setOnboardingShell("flow");
    }
  }, [showOnboarding]);

  const handleOnboardingShellChange = useCallback((shell: "flow" | "results") => {
    setOnboardingShell(shell);
  }, []);

  return (
    <>
      <div
        className={`relative flex w-full min-w-0 max-w-full flex-col overflow-x-clip ${
          showOnboarding
            ? onboardingShell === "results"
              ? "w-full pb-16 sm:pb-20"
              : "min-h-0 flex-1 pb-2 sm:pb-4"
            : "min-h-[calc(100dvh-4rem)] pb-12 sm:pb-20"
        }`}
      >
        {/* Doodles */}
        <AnimatePresence>
          {!showOnboarding && (
            <>
              <Doodle className="top-20 right-[8%] sm:right-[14%] hidden sm:block">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M28 6L34 12L14 32L6 34L8 26Z" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
                  <path d="M26 8L32 14" stroke="#2563EB" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
                  <path d="M8 26L14 32" stroke="#2563EB" strokeWidth="0.8" strokeLinecap="round" opacity="0.2" />
                </svg>
              </Doodle>

              <Doodle className="top-24 left-[8%] sm:left-[14%] hidden sm:block">
                <svg width="50" height="16" viewBox="0 0 50 16" fill="none">
                  <path d="M4 12C12 4 20 14 28 6C36 -2 44 10 48 8" stroke="#2563EB" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
                </svg>
              </Doodle>
            </>
          )}
        </AnimatePresence>

        {/* Hero */}
        <AnimatePresence>
          {!showOnboarding && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.97, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-5xl mx-auto w-full min-w-0 px-4 sm:px-6 pt-12 sm:pt-16 pb-4 text-left relative z-10"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-[1.65rem] sm:text-3xl md:text-4xl lg:text-[44px] text-gray-900 mb-4 text-balance"
                style={{ fontWeight: 700, lineHeight: 1.15 }}
              >
                Transformamos problemas en{" "}
                <span className="text-blue-600">soluciones digitales</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[14px] sm:text-[15px] text-gray-500 mb-6 max-w-lg text-pretty"
              >
                Analizamos, diseñamos y desarrollamos tu presencia digital de principio a fin.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="relative flex flex-col w-full min-w-0 sm:inline-flex sm:flex-row sm:w-auto items-stretch sm:items-center gap-3"
              >
                <button
                  onClick={() => setDiagnosticoModalOpen(true)}
                  className="inline-flex justify-center px-5 py-2.5 text-[13px] text-white rounded-lg bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] hover:shadow-[0_4px_20px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  style={{ fontWeight: 600 }}
                >
                  Comienza tu diagnóstico
                </button>
                <Link
                  to="/conocenos"
                  className="inline-flex justify-center px-5 py-2.5 text-[13px] text-gray-700 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-center"
                  style={{ fontWeight: 600 }}
                >
                  Conócenos
                </Link>
                {/* Arrow doodle */}
                <Doodle className="-left-20 top-1/2 -translate-y-1/2 hidden md:block">
                  <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
                    <path d="M4 20C16 22 30 18 46 12" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 3" opacity="0.4" />
                    <path d="M40 6L48 12L40 16" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                  </svg>
                  <span className="text-[9px] text-blue-500/40 block -mt-0.5 text-center" style={{ fontWeight: 500 }}>comienza aqui</span>
                </Doodle>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Process Animation */}
        <motion.section
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className={`relative mx-auto flex w-full min-w-0 max-w-full justify-center px-3 sm:px-4 ${
            showOnboarding
              ? onboardingShell === "results"
                ? "mt-2 flex-col items-center gap-4 pb-4 sm:mt-3 sm:pb-6 2xl:flex-row 2xl:items-start 2xl:justify-center 2xl:pb-8"
                : "min-h-0 flex-1 flex-col items-stretch gap-4 pb-2 sm:mt-3 sm:pb-4 2xl:flex-row 2xl:items-start 2xl:pb-6"
              : "max-w-5xl min-h-0 flex-1 items-center mt-6 sm:mt-8"
          }`}
        >
          <AnimatePresence>
            {!showOnboarding && (
              <>
                <Doodle className="left-2 top-1/3 hidden lg:block">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="14" stroke="#2563EB" strokeWidth="1" opacity="0.15" strokeDasharray="4 3" />
                    <circle cx="20" cy="20" r="5" stroke="#2563EB" strokeWidth="0.8" opacity="0.25" />
                  </svg>
                </Doodle>

                <Doodle className="right-6 -top-6 hidden lg:block">
                  <span className="text-[11px] text-blue-500/60 block mb-1 tracking-wide" style={{ fontWeight: 600 }}>nuestro proceso ↓</span>
                </Doodle>

                <Doodle className="left-6 -bottom-2 hidden md:block">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 3V15M3 9H15" stroke="#2563EB" strokeWidth="0.8" strokeLinecap="round" opacity="0.2" />
                  </svg>
                </Doodle>
              </>
            )}
          </AnimatePresence>

          <div
            className={`min-w-0 ${
              showOnboarding
                ? onboardingShell === "results"
                  ? "flex w-full max-w-full justify-center"
                  : "w-full max-w-none"
                : "w-full max-w-5xl rounded-xl sm:rounded-2xl overflow-hidden shadow-lg"
            }`}
          >
            <AnimatePresence mode="wait">
              {!showOnboarding ? (
                <motion.div
                  key="process"
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProcessAnimation />
                </motion.div>
              ) : (
                <motion.div
                  key="onboarding"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className={
                    onboardingShell === "results"
                      ? "flex w-full min-w-0 flex-col items-center"
                      : "h-[min(720px,calc(100dvh-8.5rem))] max-h-[min(720px,calc(100dvh-8.5rem))] w-full min-h-0"
                  }
                >
                  <div
                    className={
                      onboardingShell === "results"
                        ? "flex w-full max-w-full min-w-0 flex-col items-center gap-4 2xl:w-fit 2xl:max-w-[min(100vw-2rem,calc(64rem+20rem+1.5rem))] 2xl:flex-row 2xl:items-start 2xl:justify-center 2xl:gap-5"
                        : "flex h-full min-h-0 w-full max-w-full min-w-0 flex-col items-stretch justify-center gap-4 2xl:flex-row 2xl:items-start 2xl:gap-5"
                    }
                  >
                    <div
                      className={
                        onboardingShell === "results"
                          ? "flex w-full min-w-0 max-w-5xl shrink-0 flex-col self-center rounded-xl border border-gray-100 bg-white shadow-lg sm:rounded-2xl 2xl:self-auto"
                          : "flex h-full min-h-0 w-full min-w-0 flex-1 max-w-5xl flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg sm:rounded-2xl"
                      }
                    >
                      <Suspense
                        fallback={
                          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-12 text-[13px] text-gray-500">
                            <Loader2 className="h-7 w-7 animate-spin text-blue-600" aria-hidden />
                            <span>Cargando diagnóstico…</span>
                          </div>
                        }
                      >
                        <Onboarding
                          onClose={() => {
                            setDiagnosticoModalOpen(false);
                            setDismissFollowUp(false);
                          }}
                          onShellPhaseChange={handleOnboardingShellChange}
                        />
                      </Suspense>
                    </div>

                    <div className="hidden w-full min-w-0 shrink-0 lg:block 2xl:w-auto">
                      {!dismissFollowUp && (
                        <div className="mx-auto w-full max-w-[320px] 2xl:mx-0">
                          <FollowUpSidePanel onDismiss={() => setDismissFollowUp(true)} />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </div>
    </>
  );
}
