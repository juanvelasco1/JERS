import { Link, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProcessAnimation } from "./ProcessAnimation";
import { Onboarding } from "./Onboarding";
import { ContactCard } from "./ContactCard";
import { AboutCard } from "./AboutCard";

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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("diagnostico") === "true") {
      setShowOnboarding(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] pb-20 relative overflow-x-hidden flex flex-col">
        {/* Doodles */}
        <AnimatePresence>
          {!showOnboarding && !showContact && (
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
          {!showOnboarding && !showContact && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.97, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-5xl mx-auto px-5 sm:px-6 pt-16 pb-4 text-left relative z-10"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-[44px] text-gray-900 mb-4"
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
                className="text-[15px] text-gray-500 mb-6 max-w-lg"
              >
                Analizamos, diseñamos y desarrollamos tu presencia digital de principio a fin.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="relative inline-flex items-center gap-3"
              >
                <button
                  onClick={() => setShowOnboarding(true)}
                  className="inline-block px-5 py-2.5 text-[13px] text-white rounded-lg bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] hover:shadow-[0_4px_20px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  style={{ fontWeight: 600 }}
                >
                  Comienza tu diagnóstico
                </button>
                <Link
                  to="#"
                  onClick={(e) => { e.preventDefault(); setShowContact(true); }}
                  className="inline-block px-5 py-2.5 text-[13px] text-gray-700 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
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
          className="max-w-5xl w-full mx-auto px-4 mt-8 relative flex items-center justify-center flex-1"
        >
          <AnimatePresence>
            {!showOnboarding && !showContact && (
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

          <div className="rounded-2xl overflow-hidden shadow-lg w-full max-w-5xl">
            <AnimatePresence mode="wait">
              {!showOnboarding && !showContact ? (
                <motion.div
                  key="process"
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProcessAnimation />
                </motion.div>
              ) : showOnboarding ? (
                <motion.div
                  key="onboarding"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white border border-gray-100 w-full"
                  style={{ height: "clamp(560px, calc(100dvh - 120px), 760px)" }}
                >
                  <Onboarding onClose={() => setShowOnboarding(false)} />
                </motion.div>
              ) : (
                <motion.div
                  key="about"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white border border-gray-100 w-full rounded-2xl"
                  style={{ height: "clamp(560px, calc(100dvh - 120px), 760px)" }}
                >
                  <AboutCard onClose={() => setShowContact(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </div>
    </>
  );
}