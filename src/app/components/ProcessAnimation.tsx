import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";

/*
  Visual narrative of the JERS process:
  Scene 0 – Person has a problem (confused, question marks)
  Scene 1 – JERS listens & diagnoses (conversation, magnifying glass)
  Scene 2 – Building the solution (code, bricks stacking)
  Scene 3 – Launch & delivery (rocket lifting off)
  
  Each scene plays for ~3.5s then transitions to the next.
  The connecting line draws itself between scenes.
*/

function PersonIcon({ mood }: { mood: "confused" | "talking" | "working" | "happy" }) {
  // Simple stick-figure-ish person drawn with SVG
  const headColor = mood === "confused" ? "#ef4444" : mood === "happy" ? "#22c55e" : "#3b82f6";
  return (
    <svg width="32" height="44" viewBox="0 0 32 44" fill="none">
      {/* Head */}
      <circle cx="16" cy="8" r="6" stroke={headColor} strokeWidth="2" fill="none" />
      {/* Body */}
      <line x1="16" y1="14" x2="16" y2="30" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
      {/* Arms */}
      {mood === "confused" && (
        <>
          <line x1="16" y1="20" x2="6" y2="16" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="20" x2="26" y2="16" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {mood === "talking" && (
        <>
          <line x1="16" y1="20" x2="8" y2="24" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="20" x2="26" y2="18" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {mood === "working" && (
        <>
          <line x1="16" y1="20" x2="8" y2="26" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="20" x2="24" y2="26" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {mood === "happy" && (
        <>
          <line x1="16" y1="20" x2="6" y2="14" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="20" x2="26" y2="14" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {/* Legs */}
      <line x1="16" y1="30" x2="10" y2="42" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="30" x2="22" y2="42" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
      {/* Expression */}
      {mood === "confused" && (
        <>
          <circle cx="14" cy="7" r="0.8" fill="#374151" />
          <circle cx="18" cy="7" r="0.8" fill="#374151" />
          <path d="M13 10 Q16 12 19 10" stroke="#374151" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </>
      )}
      {mood === "happy" && (
        <>
          <circle cx="14" cy="7" r="0.8" fill="#374151" />
          <circle cx="18" cy="7" r="0.8" fill="#374151" />
          <path d="M13 9 Q16 12 19 9" stroke="#374151" strokeWidth="1" fill="none" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

const scenes = [
  {
    key: "problem",
    label: "Tienes un problema",
    sublabel: "y no sabes por dónde empezar",
  },
  {
    key: "diagnose",
    label: "Nos cuentas tu idea",
    sublabel: "escuchamos, analizamos, entendemos",
  },
  {
    key: "build",
    label: "Construimos juntos",
    sublabel: "diseño, desarrollo, iteración",
  },
  {
    key: "launch",
    label: "Tu solución está lista",
    sublabel: "lanzamos y seguimos contigo",
  },
];

export function ProcessAnimation() {
  const [active, setActive] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  useEffect(() => {
    if (!isInView) return;
    // Start the sequence after a small delay
    const startTimeout = setTimeout(() => setActive(0), 400);
    return () => clearTimeout(startTimeout);
  }, [isInView]);

  useEffect(() => {
    if (active < 0) return;
    if (active >= scenes.length) {
      // Reset loop
      const resetTimeout = setTimeout(() => setActive(0), 2000);
      return () => clearTimeout(resetTimeout);
    }
    const timeout = setTimeout(() => setActive((a) => a + 1), 3200);
    return () => clearTimeout(timeout);
  }, [active]);

  const currentScene = active >= 0 && active < scenes.length ? active : active >= scenes.length ? scenes.length - 1 : -1;

  return (
    <div
      ref={ref}
      className="w-full h-[240px] sm:h-[300px] md:h-[360px] bg-[#fafbfc] flex flex-col items-center justify-center relative overflow-hidden select-none"
    >
      {/* Hand-drawn style wavy line connecting the journey */}
      <svg
        className="absolute bottom-[52px] sm:bottom-[58px] left-0 w-full h-[40px] pointer-events-none"
        viewBox="0 0 800 40"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0 20 Q100 8, 200 20 T400 20 T600 20 T800 20"
          stroke="#e5e7eb"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isInView ? 1 : 0 }}
          transition={{ duration: 2, delay: 0.2, ease: "easeInOut" }}
        />
        <motion.path
          d="M0 20 Q100 8, 200 20 T400 20 T600 20 T800 20"
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{
            pathLength: currentScene >= 0 ? (currentScene + 1) / scenes.length : 0,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>

      {/* Scenes */}
      <div className="relative z-10 flex items-end justify-between w-full max-w-[720px] px-8 sm:px-6 gap-2">
        {scenes.map((scene, i) => {
          const isCurrent = currentScene === i;
          const isPast = currentScene > i;
          const isFuture = currentScene < i;

          return (
            <div key={scene.key} className="flex flex-col items-center w-1/4 overflow-visible">
              {/* Scene illustration */}
              <motion.div
                className="mb-2 relative overflow-hidden"
                style={{ width: 72, height: 80 }}
                initial={{ opacity: 0, y: 16 }}
                animate={{
                  opacity: isFuture && active >= 0 ? 0.15 : isPast ? 0.4 : isCurrent ? 1 : 0,
                  y: isCurrent ? 0 : isPast ? 4 : 16,
                  scale: isCurrent ? 1 : 0.85,
                }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {i === 0 && <SceneProblem active={isCurrent} />}
                {i === 1 && <SceneDiagnose active={isCurrent} />}
                {i === 2 && <SceneBuild active={isCurrent} />}
                {i === 3 && <SceneLaunch active={isCurrent} />}
              </motion.div>

              {/* Dot on the timeline */}
              <motion.div
                className="w-3 h-3 rounded-full border-2 mb-4 sm:mb-5"
                animate={{
                  borderColor: isCurrent ? "#3b82f6" : isPast ? "#93c5fd" : "#d1d5db",
                  backgroundColor: isCurrent ? "#3b82f6" : isPast ? "#93c5fd" : "#fff",
                  scale: isCurrent ? 1.3 : 1,
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Label */}
              <motion.div
                className="text-center"
                animate={{
                  opacity: isCurrent ? 1 : isPast ? 0.45 : 0.2,
                }}
                transition={{ duration: 0.4 }}
              >
                <p
                  className="text-[10px] sm:text-[12px] text-gray-800 whitespace-nowrap"
                  style={{ fontWeight: isCurrent ? 600 : 400 }}
                >
                  {scene.label}
                </p>
                <AnimatePresence>
                  {isCurrent && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[9px] sm:text-[11px] text-gray-400 mt-0.5 whitespace-nowrap"
                    >
                      {scene.sublabel}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Scene Illustrations ────────────────────────────── */

function SceneProblem({ active }: { active: boolean }) {
  return (
    <div className="relative w-full h-full flex items-end justify-center">
      <PersonIcon mood="confused" />
      {/* Floating question marks */}
      {active && (
        <>
          <motion.span
            className="absolute top-0 right-1 text-[16px]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: [0, 1, 1, 0], y: [6, -2, -2, -8] }}
            transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.2, 0.7, 1] }}
          >
            ?
          </motion.span>
          <motion.span
            className="absolute top-2 left-1 text-[12px] text-red-400"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: [0, 1, 1, 0], y: [4, -4, -4, -10] }}
            transition={{ duration: 2.8, delay: 0.5, repeat: Infinity, times: [0, 0.2, 0.7, 1] }}
          >
            ?
          </motion.span>
          <motion.span
            className="absolute top-0 left-4 text-[11px] text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.7, 0], y: [2, -4, -4, -8] }}
            transition={{ duration: 2, delay: 1, repeat: Infinity, times: [0, 0.2, 0.7, 1] }}
          >
            !
          </motion.span>
        </>
      )}
    </div>
  );
}

function SceneDiagnose({ active }: { active: boolean }) {
  return (
    <div className="relative w-full h-full flex items-end justify-center">
      <PersonIcon mood="talking" />
      {/* Chat bubble */}
      {active && (
        <motion.div
          className="absolute top-0 right-0 bg-blue-600 rounded-lg rounded-bl-none px-2 py-1"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <motion.div className="flex gap-[3px]">
            {[0, 1, 2].map((j) => (
              <motion.div
                key={j}
                className="w-[4px] h-[4px] bg-white rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, delay: j * 0.2, repeat: Infinity }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
      {/* Magnifying glass icon */}
      {active && (
        <motion.svg
          className="absolute bottom-1 left-0"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          initial={{ opacity: 0, rotate: -20 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <circle cx="10" cy="10" r="6" stroke="#3b82f6" strokeWidth="2" />
          <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        </motion.svg>
      )}
    </div>
  );
}

function SceneBuild({ active }: { active: boolean }) {
  return (
    <div className="relative w-full h-full flex items-end justify-center">
      <PersonIcon mood="working" />
      {/* Stacking blocks */}
      {active && (
        <div className="absolute right-0 top-4">
          {[0, 1, 2].map((j) => (
            <motion.div
              key={j}
              className="w-[14px] h-[10px] rounded-[2px] mb-[2px]"
              style={{
                backgroundColor: j === 0 ? "#93c5fd" : j === 1 ? "#3b82f6" : "#1d4ed8",
              }}
              initial={{ opacity: 0, x: 12, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{
                delay: 0.3 + j * 0.35,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))}
        </div>
      )}
      {/* Code symbol */}
      {active && (
        <motion.span
          className="absolute left-0 top-6 text-[13px] text-blue-500"
          style={{ fontFamily: "monospace", fontWeight: 700 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0.6] }}
          transition={{ delay: 1, duration: 1.5 }}
        >
          {"</>"}
        </motion.span>
      )}
    </div>
  );
}

function SceneLaunch({ active }: { active: boolean }) {
  return (
    <div className="relative w-full h-full flex items-end justify-center">
      <PersonIcon mood="happy" />
      {/* Rocket */}
      {active && (
        <motion.svg
          className="absolute top-0 right-1"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          initial={{ opacity: 0, y: 10, x: -4 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <path
            d="M4.5 16.5L8 13M12 8l3.5-3.5M8 13l3-1 6-6c1-1 1.5-2.5.5-3.5S15 -1.5 14 -.5l-6 6-1 3z"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M6 18l-2-2" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 21l-1-1" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </motion.svg>
      )}
      {/* Sparkles */}
      {active && (
        <>
          {[
            { x: 2, y: 4, delay: 0.6, size: 6 },
            { x: 50, y: 14, delay: 0.9, size: 4 },
            { x: 10, y: 30, delay: 1.2, size: 5 },
          ].map((s, j) => (
            <motion.svg
              key={j}
              className="absolute"
              style={{ left: s.x, top: s.y }}
              width={s.size * 2}
              height={s.size * 2}
              viewBox="0 0 12 12"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.5] }}
              transition={{ delay: s.delay, duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
            >
              <path
                d="M6 0L7 4.5L12 6L7 7.5L6 12L5 7.5L0 6L5 4.5Z"
                fill="#f59e0b"
                opacity="0.7"
              />
            </motion.svg>
          ))}
        </>
      )}
    </div>
  );
}