import * as React from "react";
import { motion } from "motion/react";
import { CheckCircle2, ChevronsRight, Globe2, User } from "lucide-react";
import type { SolutionFlowData } from "@/app/lib/diagnosisAi";

const FLOW_ICONS = [User, Globe2, ChevronsRight, CheckCircle2] as const;
const FLOW_RING = [
  "bg-blue-600 text-white shadow-sm rounded-full",
  "bg-blue-600 text-white shadow-sm rounded-xl",
  "bg-blue-600 text-white shadow-sm rounded-xl",
  "bg-emerald-500 text-white shadow-sm rounded-full",
] as const;

export function SolutionFlowProposal({
  flow,
  variant = "compact",
}: {
  flow: SolutionFlowData;
  /** `comfortable`: página Mi proyecto; `compact`: modal de diagnóstico */
  variant?: "compact" | "comfortable";
}) {
  const steps = flow.steps.slice(0, 4);
  const isComfort = variant === "comfortable";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isComfort ? 0.1 : 0.82 }}
      className={
        isComfort
          ? "rounded-xl border border-blue-100 bg-gradient-to-b from-white to-blue-50/50 p-4 sm:p-5"
          : "mt-2 shrink-0 rounded-xl border border-blue-100 bg-gradient-to-b from-white to-blue-50/50 p-2.5 sm:p-3"
      }
    >
      <p
        className={
          isComfort
            ? "text-[11px] text-blue-600 mb-3"
            : "text-[9px] sm:text-[10px] text-blue-600 mb-2 text-center sm:text-left"
        }
        style={{ fontWeight: 600, letterSpacing: "0.05em" }}
      >
        FLUJO DE LA SOLUCIÓN PROPUESTA
      </p>

      <div
        className={
          isComfort
            ? "flex w-full items-start justify-center gap-1 sm:gap-2"
            : "flex w-full items-start justify-center gap-1 sm:gap-1.5"
        }
      >
        {steps.map((s, i) => {
          const Icon = FLOW_ICONS[i] ?? User;
          const ring = FLOW_RING[i] ?? FLOW_RING[0];
          const iconWrap = isComfort
            ? "flex h-10 w-10 shrink-0 items-center justify-center sm:h-11 sm:w-11"
            : "flex h-8 w-8 shrink-0 items-center justify-center sm:h-9 sm:w-9";
          return (
            <React.Fragment key={`${s.title}-${i}`}>
              <div
                className={
                  isComfort
                    ? "flex min-w-0 flex-[1_1_0] basis-0 flex-col items-center px-1 text-center sm:px-1.5"
                    : "flex min-w-0 flex-[1_1_0] basis-0 flex-col items-center px-0.5 text-center sm:px-1"
                }
              >
                <div className={`${iconWrap} ${ring}`}>
                  <Icon className={isComfort ? "h-4 w-4 sm:h-[18px] sm:w-[18px]" : "h-3.5 w-3.5 sm:h-4 sm:w-4"} strokeWidth={2} />
                </div>
                <p
                  className={
                    isComfort
                      ? "mt-2 w-full max-w-full break-words text-[11px] leading-tight text-gray-800 [overflow-wrap:anywhere] line-clamp-2 sm:text-xs"
                      : "mt-1 w-full max-w-full break-words text-[8px] leading-tight text-gray-800 [overflow-wrap:anywhere] line-clamp-2 sm:text-[9px]"
                  }
                  style={{ fontWeight: 600 }}
                  title={`${s.title} — ${s.subtitle}`}
                >
                  {s.title}
                </p>
                <p
                  className={
                    isComfort
                      ? "mt-1 line-clamp-2 w-full max-w-full break-words text-[10px] leading-snug text-gray-500 [overflow-wrap:anywhere] sm:text-[11px]"
                      : "mt-0.5 line-clamp-2 w-full max-w-full break-words text-[7px] leading-snug text-gray-500 [overflow-wrap:anywhere] sm:text-[8px]"
                  }
                >
                  {s.subtitle}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex w-4 shrink-0 items-center justify-center self-center text-blue-300 sm:w-5 ${isComfort ? "px-0 pt-3" : "px-0 pt-2"}`}
                  aria-hidden
                >
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="opacity-75 sm:w-3 sm:h-[7px]">
                    <path
                      d="M0 3h6M6 0.5L9 3 6 5.5"
                      stroke="currentColor"
                      strokeWidth="0.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="2 1.5"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div
        className={
          isComfort
            ? "mt-4 rounded-lg border border-blue-100/90 bg-blue-50/70 px-3 py-3 sm:px-4"
            : "mt-2 rounded-lg border border-blue-100/90 bg-blue-50/70 px-2 py-2 sm:px-2.5"
        }
      >
        <p
          className={
            isComfort
              ? "text-xs sm:text-[13px] leading-relaxed text-gray-600"
              : "text-[9px] leading-snug text-gray-600 line-clamp-4 sm:text-[10px] sm:leading-relaxed sm:line-clamp-none"
          }
        >
          {flow.narrative}
        </p>
      </div>
    </motion.div>
  );
}
