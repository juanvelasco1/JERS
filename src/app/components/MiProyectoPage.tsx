/// <reference types="vite/client" />
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router";
import { CalendarCheck, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useSupabaseSession } from "@/app/hooks/useSupabaseSession";
import {
  type AIDiagnosis,
  buildFallbackSolutionFlow,
  parseStoredAIDiagnosis,
} from "@/app/lib/diagnosisAi";
import { getIndustriaLabel, getInvestmentLabel, getTamanoLabel } from "@/app/lib/onboardingDisplayLabels";
import { JERS_CAL_30MIN_BOOKING_URL } from "@/app/lib/jersBooking";
import { SolutionFlowProposal } from "@/app/components/SolutionFlowProposal";
import { ONBOARDING_USER_LINK_REPAIR_SQL } from "@/app/lib/onboardingUserLinkRepairSql";
import { tryClaimPendingSubmissionFromStorage } from "@/app/lib/diagnosticClaimStorage";
import { readOnboardingDraft, type OnboardingDraftV1 } from "@/app/lib/onboardingDraft";
import { getSimulatedPhases, type SimulatedPhase } from "@/app/lib/simulatedMiProyectoProgress";

type SubmissionRow = {
  id: string;
  updated_at: string;
  completed_at: string | null;
  empresa: string | null;
  industria: string | null;
  industria_otro: string | null;
  tamano: string | null;
  problema: string | null;
  presupuesto: string | null;
  answers_raw: Record<string, unknown> | null;
};

function industriaLine(row: SubmissionRow): string {
  if (row.industria === "otro" && row.industria_otro?.trim()) {
    return row.industria_otro.trim();
  }
  return getIndustriaLabel(row.industria || "");
}

/** Si hay resultados en el borrador local pero aún no hay fila en Supabase vinculada al usuario. */
function buildSubmissionRowFromLocalDraft(draft: OnboardingDraftV1 | null): SubmissionRow | null {
  if (!draft || draft.phase !== "results" || !draft.aiDiagnosis) return null;
  const d = draft.data;
  const problema =
    d.problema?.trim() ||
    [...draft.selectedPrompts, draft.extraDetail].filter(Boolean).join("; ").trim() ||
    null;
  return {
    id: "local-draft-view",
    updated_at: new Date().toISOString(),
    completed_at: null,
    empresa: d.empresa?.trim() || null,
    industria: d.industria?.trim() || null,
    industria_otro: d.industria_otro?.trim() || null,
    tamano: d["tamaño"]?.trim() || null,
    problema,
    presupuesto: d.presupuesto?.trim() || null,
    answers_raw: {
      ...d,
      ...(problema ? { problema } : {}),
      ai_diagnosis: draft.aiDiagnosis,
    },
  };
}

function splitSummaryIntoParagraphs(text: string): string[] {
  const chunks = text
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return chunks.length > 0 ? chunks : [text];
}

function DiagnosisSummaryCard({ text }: { text: string }) {
  const paragraphs = splitSummaryIntoParagraphs(text);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-0 rounded-xl border border-gray-100 bg-white px-5 py-6 sm:px-6 sm:py-7"
    >
      <h2 className="text-[15px] sm:text-base text-blue-700 tracking-tight pb-3 mb-1 border-b border-blue-100/90" style={{ fontWeight: 700 }}>
        Resumen del diagnóstico
      </h2>
      <div className="mt-4 space-y-3.5 text-[15px] sm:text-base leading-[1.7] text-gray-800 text-pretty">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </motion.div>
  );
}

function ProjectProfileCard({ row }: { row: SubmissionRow }) {
  const nombre = row.empresa?.trim() || "Tu negocio";
  const reto = row.problema?.trim();
  const sectorLine = [industriaLine(row), row.tamano ? getTamanoLabel(row.tamano) : null].filter(Boolean).join(" · ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 }}
      className="flex min-h-0 flex-col gap-5 rounded-xl border border-gray-100 bg-white px-5 py-6 sm:px-6 sm:py-7"
    >
      <h2 className="text-[15px] sm:text-base text-blue-700 tracking-tight pb-3 border-b border-blue-100/90" style={{ fontWeight: 700 }}>
        Contexto del negocio
      </h2>
      <p className="text-[15px] sm:text-[16px] leading-snug text-gray-900" style={{ fontWeight: 600 }}>
        {nombre}
      </p>
      <p className="text-[15px] sm:text-base leading-relaxed text-gray-700">{sectorLine}</p>
      {reto && <p className="text-[15px] sm:text-base leading-relaxed text-gray-600">{reto}</p>}
      <p className="border-t border-gray-100 pt-5 text-[15px] sm:text-base leading-snug text-gray-800">
        {getInvestmentLabel(row.presupuesto || "")}
      </p>
    </motion.div>
  );
}

function SimulatedProgressPreview({ phases }: { phases: SimulatedPhase[] }) {
  return (
    <section className="mb-8 rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-[10px] tracking-[0.06em] text-blue-600" style={{ fontWeight: 600 }}>
            VISTA PREVIA DE AVANCES
          </p>
          <h2 className="text-[15px] leading-snug text-blue-800" style={{ fontWeight: 700 }}>
            Tablero de etapas (simulado)
          </h2>
        </div>
        <span
          className="inline-flex items-center self-start rounded-full border border-blue-200 bg-blue-50/80 px-2.5 py-1 text-[10px] text-blue-800"
          style={{ fontWeight: 600 }}
        >
          Ilustrativo · no es estado real
        </span>
      </div>
      <p className="text-[12px] text-gray-600 leading-relaxed mb-5">
        Ejemplo de cómo podría visualizarse el avance cuando exista un plan firmado y entregas en curso. Los porcentajes
        son orientativos y varían solo como demostración según tu análisis guardado.
      </p>
      <ul className="space-y-4">
        {phases.map((p) => (
          <li key={p.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
              <span className="text-[13px] text-gray-900" style={{ fontWeight: 600 }}>
                {p.title}
              </span>
              <span
                className={`text-[10px] uppercase tracking-wide ${
                  p.status === "completado"
                    ? "text-emerald-600"
                    : p.status === "en curso"
                      ? "text-blue-600"
                      : "text-gray-400"
                }`}
                style={{ fontWeight: 600 }}
              >
                {p.status === "completado" ? "Completado" : p.status === "en curso" ? "En curso" : "Pendiente"}
                {p.percent > 0 ? ` · ${p.percent}%` : ""}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mb-2 leading-snug">{p.subtitle}</p>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${p.percent}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  p.status === "completado" ? "bg-emerald-500" : p.status === "en curso" ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MiProyectoPage() {
  const { supabase, user, loading: authLoading } = useSupabaseSession();
  const [row, setRow] = useState<SubmissionRow | null>(null);
  /** `draft`: datos solo en este navegador hasta que exista fila con `user_id` en Supabase. */
  const [rowOrigin, setRowOrigin] = useState<"server" | "draft">("server");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [repairCopied, setRepairCopied] = useState(false);

  const load = useCallback(async () => {
    if (!supabase || !user) {
      setFetching(false);
      return;
    }
    setLoadError(null);
    setFetching(true);
    await tryClaimPendingSubmissionFromStorage(supabase);
    const { data, error } = await supabase
      .from("onboarding_submissions")
      .select("id, updated_at, completed_at, empresa, industria, industria_otro, tamano, problema, presupuesto, answers_raw")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false, nullsFirst: false })
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn("MiProyecto load:", error);
      setLoadError(error.message);
      setRow(null);
      setRowOrigin("server");
    } else if (data) {
      setRow(data as SubmissionRow);
      setRowOrigin("server");
    } else {
      const fromDraft = buildSubmissionRowFromLocalDraft(readOnboardingDraft());
      if (fromDraft) {
        setRow(fromDraft);
        setRowOrigin("draft");
      } else {
        setRow(null);
        setRowOrigin("server");
      }
    }
    setFetching(false);
  }, [supabase, user]);

  useEffect(() => {
    void load();
  }, [load]);

  const diagnosis = useMemo(() => {
    if (!row?.answers_raw) return null;
    return parseStoredAIDiagnosis(row.answers_raw.ai_diagnosis);
  }, [row]);

  const flowForUi = useMemo(() => {
    if (!diagnosis) return null;
    return diagnosis.solutionFlow ?? buildFallbackSolutionFlow(diagnosis.recommendations);
  }, [diagnosis]);

  const updatedLabel = useMemo(() => {
    if (!row?.updated_at) return null;
    try {
      return new Date(row.updated_at).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return null;
    }
  }, [row]);

  const simulatedPhases = useMemo(() => getSimulatedPhases(row?.id ?? "sin-id"), [row?.id]);

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="flex items-center gap-2 text-[13px] text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" aria-hidden />
          Cargando…
        </div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <p className="text-[14px] text-gray-600 leading-relaxed">
          Para ver tu proyecto necesitas configurar Supabase en el entorno del sitio.
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login?next=/mi-proyecto" replace />;
  }

  if (fetching) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="flex items-center gap-2 text-[13px] text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" aria-hidden />
          Cargando tu diagnóstico…
        </div>
      </div>
    );
  }

  if (loadError) {
    const missingUserId =
      /user_id/i.test(loadError) && /does not exist|no existe/i.test(loadError);

    const copyRepairSql = async () => {
      try {
        await navigator.clipboard.writeText(ONBOARDING_USER_LINK_REPAIR_SQL);
        setRepairCopied(true);
        window.setTimeout(() => setRepairCopied(false), 2500);
      } catch {
        // ignore
      }
    };

    if (missingUserId) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-[13px] text-amber-950 leading-relaxed">
            <h2 className="text-base text-amber-950 mb-2" style={{ fontWeight: 700 }}>
              Falta la columna <code className="text-[13px] bg-amber-100/90 px-1.5 py-0.5 rounded">user_id</code> en Supabase
            </h2>
            <p className="mb-3 text-amber-950/95">
              En el panel de tu proyecto: <strong>SQL Editor</strong> → pega el SQL de abajo (o usa <strong>Copiar SQL</strong>) →{" "}
              <strong>Run</strong>. Luego vuelve aquí y pulsa <strong>Reintentar</strong>.
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                type="button"
                onClick={() => void copyRepairSql()}
                className="rounded-lg bg-amber-800 px-4 py-2 text-[13px] text-white hover:bg-amber-900 transition-colors cursor-pointer"
                style={{ fontWeight: 600 }}
              >
                {repairCopied ? "Copiado al portapapeles" : "Copiar SQL"}
              </button>
              <button
                type="button"
                onClick={() => void load()}
                className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-[13px] text-amber-950 hover:bg-amber-100/50 transition-colors cursor-pointer"
                style={{ fontWeight: 600 }}
              >
                Reintentar
              </button>
            </div>
            <label className="block text-[11px] text-amber-900/80 mb-1" style={{ fontWeight: 600 }}>
              SQL (mismo que la migración del repo)
            </label>
            <textarea
              readOnly
              spellCheck={false}
              rows={18}
              value={ONBOARDING_USER_LINK_REPAIR_SQL}
              className="w-full rounded-lg border border-amber-200/80 bg-white/90 p-3 font-mono text-[11px] leading-snug text-gray-800 resize-y min-h-[220px]"
            />
            <p className="mt-3 text-[12px] text-amber-900/85">
              Alternativa con CLI: <code className="rounded bg-amber-100/80 px-1">supabase db push</code> en la raíz del repo,
              con el proyecto enlazado.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <p className="text-[14px] text-red-600 mb-4">{loadError}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="text-[13px] text-blue-600 hover:text-blue-800 cursor-pointer"
          style={{ fontWeight: 600 }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!row) {
    return (
      <div className="max-w-xl mx-auto px-4 py-14 text-center">
        <h1 className="text-xl text-gray-900 mb-2" style={{ fontWeight: 700 }}>
          Aún no hay un diagnóstico vinculado
        </h1>
        <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
          Tu cuenta solo ve análisis donde ya figura tu usuario. Eso ocurre al terminar el flujo y registrarte al
          final, o al iniciar sesión con un diagnóstico pendiente guardado en este navegador.
        </p>
        <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
          Si acabas de iniciar sesión o cerraste el modal antes de vincular, pulsa <strong>Actualizar</strong> para
          intentar de nuevo la vinculación automática.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-[14px] text-gray-800 hover:bg-gray-50 cursor-pointer"
            style={{ fontWeight: 600 }}
          >
            Actualizar
          </button>
          <Link
            to="/?diagnostico=true"
            className="inline-flex justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] px-5 py-2.5 text-[14px] text-white hover:opacity-95"
            style={{ fontWeight: 600 }}
          >
            Ir al diagnóstico
          </Link>
        </div>
      </div>
    );
  }

  const ai: AIDiagnosis | null = diagnosis;
  const diagnosisSummaryText =
    ai?.summary?.trim()
    ?? "El informe generado a partir de tus respuestas no está disponible en este momento; los datos del cuestionario siguen guardados en tu registro.";
  const recommendations = ai?.recommendations ?? [];
  const nextSteps = ai?.nextSteps ?? [];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 min-w-0">
      {rowOrigin === "draft" && (
        <div className="mb-6 rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50 to-amber-50/30 px-4 py-3.5 sm:px-5">
          <p className="text-[13px] text-amber-950 leading-relaxed">
            <span style={{ fontWeight: 700 }}>Vista en este dispositivo.</span> Tienes resultados del diagnóstico en el
            navegador, pero aún no hay un registro enlazado a tu cuenta en la base de datos. Pulsa{" "}
            <strong>Sincronizar</strong> tras registrarte al final del flujo, o abre el diagnóstico de nuevo desde inicio
            para generar el enlace.
          </p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-3 rounded-lg bg-amber-800 px-4 py-2 text-[12px] text-white hover:bg-amber-900 transition-colors cursor-pointer"
            style={{ fontWeight: 600 }}
          >
            Sincronizar con la cuenta
          </button>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] text-blue-600" style={{ fontWeight: 700, letterSpacing: "0.1em" }}>
            TU PROYECTO
          </p>
          <h1 className="mt-1 text-2xl tracking-tight text-gray-950 sm:text-[1.75rem]" style={{ fontWeight: 800 }}>
            {row.empresa?.trim() || "Tu negocio"}
          </h1>
          {rowOrigin === "draft" && (
            <p className="mt-2 inline-flex items-center rounded-full border border-amber-200 bg-amber-50/80 px-2.5 py-0.5 text-[11px] text-amber-900" style={{ fontWeight: 600 }}>
              Borrador local · pendiente de vincular
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-gray-500">
            <span>{industriaLine(row)}</span>
            {row.tamano && (
              <>
                <span className="text-gray-300" aria-hidden>
                  ·
                </span>
                <span>{getTamanoLabel(row.tamano)}</span>
              </>
            )}
            {updatedLabel && (
              <>
                <span className="text-gray-300" aria-hidden>
                  ·
                </span>
                <span className="inline-flex items-center gap-1 text-gray-500">
                  <CalendarCheck className="h-3.5 w-3.5 text-gray-400" aria-hidden />
                  Actualizado {updatedLabel}
                </span>
              </>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => void supabase.auth.signOut()}
          className="shrink-0 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
          style={{ fontWeight: 600 }}
        >
          Cerrar sesión
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 items-start gap-5 lg:grid-cols-2 lg:gap-6">
        <DiagnosisSummaryCard text={diagnosisSummaryText} />
        <ProjectProfileCard row={row} />
      </div>

      <SimulatedProgressPreview phases={simulatedPhases} />

      {ai?.sugerenciaConsultoria?.trim() && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-6 rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50/90 to-white p-4"
        >
          <p className="text-[10px] text-emerald-700 mb-1" style={{ fontWeight: 600, letterSpacing: "0.06em" }}>
            SUGERENCIA CLAVE
          </p>
          <p className="text-[14px] text-gray-800 leading-relaxed">{ai.sugerenciaConsultoria}</p>
        </motion.div>
      )}

      <section className="mb-8">
        <h2 className="text-[13px] text-gray-900 mb-3" style={{ fontWeight: 700 }}>
          Puntos a realizar (diagnóstico)
        </h2>
        {recommendations.length === 0 ? (
          <p className="text-[13px] text-gray-500">No hay prioridades guardadas en este registro.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendations.map((rec, i) => (
              <motion.div
                key={`${rec.area}-${i}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="rounded-xl border border-gray-100 bg-white p-4"
              >
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full inline-block mb-2 ${
                    rec.priority === "Alta"
                      ? "bg-orange-50 text-orange-600 border border-orange-100"
                      : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {rec.priority}
                </span>
                <h3 className="text-[15px] text-gray-900 mb-1 leading-snug" style={{ fontWeight: 700 }}>
                  {rec.area}
                </h3>
                <p className="text-[13px] text-gray-600 leading-relaxed">{rec.desc}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {nextSteps.length > 0 && (
        <section className="mb-8 rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
          <h2 className="text-[10px] text-blue-500 mb-3" style={{ fontWeight: 600, letterSpacing: "0.06em" }}>
            ¿QUÉ SIGUE?
          </h2>
          <ol className="space-y-3">
            {nextSteps.map((text, i) => (
              <li key={`${i}-${text}`} className="flex gap-3 items-start">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-[12px]"
                  style={{ fontWeight: 700 }}
                >
                  {i + 1}
                </span>
                <span className="text-[14px] text-gray-700 leading-relaxed pt-0.5">{text}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-[13px] text-gray-900 mb-3" style={{ fontWeight: 700 }}>
          Vista previa de la solución
        </h2>
        {flowForUi ? (
          <SolutionFlowProposal flow={flowForUi} variant="comfortable" />
        ) : (
          <p className="text-[13px] text-gray-500">No hay flujo de solución guardado para esta sesión.</p>
        )}
      </section>

      <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white">
        <p className="text-[11px] text-blue-200 mb-3" style={{ fontWeight: 600, letterSpacing: "0.06em" }}>
          SIGUIENTE PASO CON JERS
        </p>
        <p className="text-[14px] text-blue-100 mb-4 leading-relaxed">
          Agenda una llamada gratuita de 30 minutos para revisar este plan con el equipo.
        </p>
        <a
          href={JERS_CAL_30MIN_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full sm:w-auto justify-center rounded-lg bg-white px-5 py-2.5 text-[14px] text-blue-600 hover:bg-blue-50 transition-colors"
          style={{ fontWeight: 600 }}
        >
          Agendar llamada
        </a>
      </div>
    </div>
  );
}
