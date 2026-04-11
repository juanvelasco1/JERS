/// <reference types="vite/client" />
import { useEffect, useMemo, useRef, useState } from "react";
import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  type ContextoArchivoMeta,
  isValidContextoActual,
  sanitizeStorageFileName,
} from "@/app/lib/onboardingContexto";
import {
  ONBOARDING_DRAFT_STORAGE_KEY,
  clearOnboardingDraftStorage,
  clampStepIndex,
  readOnboardingDraft,
  type OnboardingDraftV1,
} from "@/app/lib/onboardingDraft";
import { CheckCircle2, ChevronsRight, Globe2, User } from "lucide-react";
import { JERS_CAL_30MIN_BOOKING_URL } from "@/app/lib/jersBooking";
import {
  type AIDiagnosis,
  type SolutionFlowData,
  buildDiagnosisUserPrompt,
  buildFallbackSolutionFlow,
  fetchGeminiDiagnosis,
  fetchOpenAIDiagnosis,
} from "@/app/lib/diagnosisAi";

const FLOW_ICONS = [User, Globe2, ChevronsRight, CheckCircle2] as const;
const FLOW_RING = [
  "bg-blue-600 text-white shadow-sm rounded-full",
  "bg-blue-600 text-white shadow-sm rounded-xl",
  "bg-blue-600 text-white shadow-sm rounded-xl",
  "bg-emerald-500 text-white shadow-sm rounded-full",
] as const;

/* ════════════════════════════════════════════════
   Diagnosis: proposed solution flow (compact for modal)
   ════════════════════════════════════════════════ */

function SolutionFlowProposal({ flow }: { flow: SolutionFlowData }) {
  const steps = flow.steps.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.82 }}
      className="mt-2 shrink-0 rounded-xl border border-blue-100 bg-gradient-to-b from-white to-blue-50/50 p-2.5 sm:p-3"
    >
      <p
        className="text-[9px] sm:text-[10px] text-blue-600 mb-2 text-center sm:text-left"
        style={{ fontWeight: 600, letterSpacing: "0.05em" }}
      >
        FLUJO DE LA SOLUCIÓN PROPUESTA
      </p>

      <div className="flex w-full items-start justify-between gap-0">
        {steps.map((s, i) => {
          const Icon = FLOW_ICONS[i] ?? User;
          const ring = FLOW_RING[i] ?? FLOW_RING[0];
          return (
            <React.Fragment key={`${s.title}-${i}`}>
              <div className="flex min-w-0 flex-[1_1_0] basis-0 flex-col items-center px-0.5 text-center">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center sm:h-9 sm:w-9 ${ring}`}>
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
                </div>
                <p
                  className="mt-1 w-full truncate text-[7px] leading-tight text-gray-800 sm:text-[8px]"
                  style={{ fontWeight: 600 }}
                  title={`${s.title} — ${s.subtitle}`}
                >
                  {s.title}
                </p>
                <p className="mt-0.5 line-clamp-2 w-full text-[6.5px] leading-snug text-gray-500 sm:text-[7px]">
                  {s.subtitle}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="flex shrink-0 items-center self-center px-0.5 pt-2 text-blue-300 sm:px-1"
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

      <div className="mt-2 rounded-lg border border-blue-100/90 bg-blue-50/70 px-2 py-2 sm:px-2.5">
        <p className="text-[9px] leading-snug text-gray-600 line-clamp-4 sm:text-[10px] sm:leading-relaxed sm:line-clamp-none">
          {flow.narrative}
        </p>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════
   Right-side: Tips, illustrations & design assets
   (contextual per step, NOT previews)
   ════════════════════════════════════════════════ */

function TipPanel({ stepId }: { stepId: string }) {
  const content: Record<string, { tag: string; title: string; tips: string[]; stat?: { number: string; label: string } }> = {
    empresa: {
      tag: "Tip",
      title: "El nombre importa",
      tips: [
        "Usa el nombre con el que tus clientes ya te conocen",
        "Si aun no tienes nombre, puedes poner tu nombre propio",
        "No te preocupes, puedes cambiarlo despues",
      ],
      stat: { number: "73%", label: "de los clientes buscan negocios por nombre en Google" },
    },
    industria: {
      tag: "¿Por qué preguntamos esto?",
      title: "Cada industria tiene necesidades distintas",
      tips: [
        "Un restaurante necesita menú online y reservas",
        "Una tienda necesita catálogo y pagos",
        "Un consultor necesita agenda y portafolio",
      ],
      stat: { number: "2.7x", label: "más conversiones con una solución adaptada al sector" },
    },
    tamaño: {
      tag: "Dato",
      title: "El tamaño define la solución",
      tips: [
        "Emprendedores solos necesitan herramientas simples y directas",
        "Equipos pequeños necesitan colaboración y orden",
        "Empresas más grandes necesitan automatización y escalabilidad",
      ],
    },
    problema: {
      tag: "Guía",
      title: "Ejemplos de lo que nos cuentan otros clientes",
      tips: [
        '"Mis clientes no me encuentran en internet"',
        '"Pierdo tiempo haciendo facturas a mano"',
        '"Quiero vender fuera de mi ciudad"',
        '"No sé si mi publicidad está funcionando"',
      ],
      stat: { number: "85%", label: "de los negocios tienen al menos 2 de estos retos" },
    },
    contexto_actual: {
      tag: "CONTEXTO",
      title: "Conocer tu punto de partida nos ayuda",
      tips: [
        "Si ya tienes algo desarrollado, podemos mejorarlo o integrarlo con nuevas piezas",
        "Si tienes una idea clara, aceleramos el descubrimiento y el prototipo",
        "Si empiezas de cero, te guiamos desde la estrategia hasta el lanzamiento",
      ],
      stat: { number: "60%", label: "de tiempo ahorrado cuando conocemos tu contexto inicial" },
    },
    presupuesto: {
      tag: "Transparencia",
      title: "Invertir bien, no invertir más",
      tips: [
        "Con menos de $5,000 puedes tener una presencia profesional",
        "Entre $5k-$20k se incluyen automatizaciones y e-commerce",
        "Proyectos a medida requieren más inversión pero generan más retorno",
      ],
      stat: { number: "4-8 meses", label: "tiempo promedio de retorno de inversión" },
    },
  };

  const c = content[stepId] || content.empresa;

  return (
    <div className="flex flex-col justify-center h-full px-2">
      {/* Decorative illustration */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        {stepId === "empresa" && (
          <svg width="100%" height="90" viewBox="0 0 280 90" fill="none" className="mx-auto max-w-[260px]">
            {/* Storefront / building */}
            <motion.rect x="90" y="30" width="100" height="55" rx="4" stroke="#93C5FD" strokeWidth="1.5" fill="#EFF6FF"
              initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ delay: 0.3, type: "spring" }} style={{ transformOrigin: "140px 85px" }}
            />
            <motion.rect x="110" y="50" width="20" height="20" rx="2" stroke="#BFDBFE" strokeWidth="1" fill="white"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            />
            <motion.rect x="150" y="50" width="20" height="20" rx="2" stroke="#BFDBFE" strokeWidth="1" fill="white"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            />
            <motion.rect x="125" y="65" width="30" height="20" rx="2" stroke="#93C5FD" strokeWidth="1.5" fill="white"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            />
            <motion.path d="M80 30L140 8L200 30" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.5 }}
            />
            {/* Name tag floating */}
            <motion.rect x="170" y="10" width="70" height="22" rx="6" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            />
            <motion.line x1="180" y1="18" x2="225" y2="18" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.85 }}
            />
            <motion.line x1="180" y1="24" x2="210" y2="24" stroke="#BFDBFE" strokeWidth="1" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9 }}
            />
          </svg>
        )}

        {stepId === "industria" && (
          <svg width="100%" height="90" viewBox="0 0 280 90" fill="none" className="mx-auto max-w-[260px]">
            {/* Grid of industry cards */}
            {[
              { x: 30, y: 10, w: 55, h: 35 },
              { x: 95, y: 10, w: 55, h: 35 },
              { x: 160, y: 10, w: 55, h: 35 },
              { x: 62, y: 52, w: 55, h: 35 },
              { x: 127, y: 52, w: 55, h: 35 },
            ].map((r, i) => (
              <motion.g key={i}>
                <motion.rect
                  x={r.x} y={r.y} width={r.w} height={r.h} rx="6"
                  stroke={i === 1 ? "#93C5FD" : "#DBEAFE"} strokeWidth={i === 1 ? "2" : "1.5"}
                  fill={i === 1 ? "#DBEAFE" : "#FAFCFF"}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.08, type: "spring" }}
                />
                <motion.line
                  x1={r.x + 10} y1={r.y + 12} x2={r.x + r.w - 10} y2={r.y + 12}
                  stroke={i === 1 ? "#60A5FA" : "#BFDBFE"} strokeWidth="1.5" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                />
                <motion.line
                  x1={r.x + 10} y1={r.y + 20} x2={r.x + r.w - 20} y2={r.y + 20}
                  stroke={i === 1 ? "#93C5FD" : "#E0ECFF"} strokeWidth="1" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.55 + i * 0.06 }}
                />
              </motion.g>
            ))}
            {/* Highlight ring on selected */}
            <motion.rect
              x="92" y="7" width="61" height="41" rx="8"
              stroke="#2563EB" strokeWidth="2" fill="none" strokeDasharray="4 3"
              initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0.3, 0.6] }}
              transition={{ delay: 0.8, duration: 2, repeat: Infinity }}
            />
          </svg>
        )}

        {stepId === "tamaño" && (
          <svg width="100%" height="90" viewBox="0 0 280 90" fill="none" className="mx-auto max-w-[260px]">
            {/* People silhouettes growing */}
            {[60, 100, 130, 155, 180].map((x, i) => (
              <motion.g key={i}>
                <motion.circle
                  cx={x} cy={35} r={i === 0 ? 10 : 7}
                  fill={i === 0 ? "#DBEAFE" : "#EFF6FF"} stroke={i === 0 ? "#60A5FA" : "#BFDBFE"} strokeWidth="1.5"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                />
                <motion.path
                  d={`M${x - 8} ${60 + (i === 0 ? 0 : 5)}C${x - 8} ${50 + (i === 0 ? 0 : 3)} ${x - 4} ${45 + (i === 0 ? 0 : 3)} ${x} ${45 + (i === 0 ? 0 : 3)}C${x + 4} ${45 + (i === 0 ? 0 : 3)} ${x + 8} ${50 + (i === 0 ? 0 : 3)} ${x + 8} ${60 + (i === 0 ? 0 : 5)}`}
                  stroke={i === 0 ? "#60A5FA" : "#BFDBFE"} strokeWidth="1.5" fill="none" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                />
              </motion.g>
            ))}
            {/* Connector lines */}
            <motion.path
              d="M70 68C90 74 170 74 190 68"
              stroke="#DBEAFE" strokeWidth="1" strokeLinecap="round" strokeDasharray="3 3"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            />
          </svg>
        )}

        {stepId === "problema" && (
          <svg width="100%" height="90" viewBox="0 0 280 90" fill="none" className="mx-auto max-w-[260px]">
            {/* Puzzle pieces / problem-solution */}
            <motion.rect x="40" y="20" width="50" height="50" rx="8" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="1.5"
              initial={{ x: 20, opacity: 0 }} animate={{ x: 40, opacity: 1 }} transition={{ delay: 0.3, type: "spring" }}
            />
            <motion.path d="M90 35C95 35 95 30 100 30C105 30 105 35 110 35" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }}
            />
            <motion.rect x="110" y="20" width="50" height="50" rx="8" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="1.5"
              initial={{ x: 130, opacity: 0 }} animate={{ x: 110, opacity: 1 }} transition={{ delay: 0.4, type: "spring" }}
            />
            <motion.path d="M160 35C165 35 165 30 170 30C175 30 175 35 180 35" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }}
            />
            <motion.rect x="180" y="20" width="50" height="50" rx="8" fill="#D1FAE5" stroke="#34D399" strokeWidth="1.5"
              initial={{ x: 200, opacity: 0 }} animate={{ x: 180, opacity: 1 }} transition={{ delay: 0.5, type: "spring" }}
            />
            {/* Check on last piece */}
            <motion.path d="M197 42L203 48L213 38" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 0.3 }}
            />
            {/* Labels */}
            <motion.line x1="52" y1="40" x2="78" y2="40" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }}
            />
            <motion.line x1="52" y1="48" x2="70" y2="48" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.65 }}
            />
            <motion.line x1="122" y1="40" x2="148" y2="40" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.65 }}
            />
            <motion.line x1="122" y1="48" x2="140" y2="48" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7 }}
            />
          </svg>
        )}

        {stepId === "contexto_actual" && (
          <svg width="100%" height="90" viewBox="0 0 280 90" fill="none" className="mx-auto max-w-[260px]">
            <motion.rect x="45" y="22" width="52" height="44" rx="8" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="1.5"
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, type: "spring" }}
            />
            <motion.path d="M97 44H118" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }}
            />
            <motion.rect x="118" y="22" width="52" height="44" rx="8" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="1.5"
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35, type: "spring" }}
            />
            <motion.path d="M138 38L144 44L154 34" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.35 }}
            />
          </svg>
        )}

        {stepId === "presupuesto" && (
          <svg width="100%" height="90" viewBox="0 0 280 90" fill="none" className="mx-auto max-w-[260px]">
            {/* Bar chart growing */}
            {[
              { x: 60, h: 25, color: "#DBEAFE", stroke: "#BFDBFE" },
              { x: 100, h: 40, color: "#DBEAFE", stroke: "#93C5FD" },
              { x: 140, h: 55, color: "#BFDBFE", stroke: "#60A5FA" },
              { x: 180, h: 45, color: "#DBEAFE", stroke: "#93C5FD" },
            ].map((bar, i) => (
              <motion.rect
                key={i}
                x={bar.x} y={80 - bar.h} width="28" height={bar.h} rx="4"
                fill={bar.color} stroke={bar.stroke} strokeWidth="1.5"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.12, type: "spring" }}
                style={{ transformOrigin: `${bar.x + 14}px 80px` }}
              />
            ))}
            {/* Trend line */}
            <motion.path
              d="M74 65L114 50L154 30L194 38"
              stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
            {/* Dot on peak */}
            <motion.circle cx="154" cy="30" r="4" fill="white" stroke="#2563EB" strokeWidth="2"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, type: "spring" }}
            />
            {/* Coin */}
            <motion.circle cx="230" cy="25" r="14" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="1.5"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: "spring" }}
            />
            <motion.text x="230" y="30" textAnchor="middle" fill="#F59E0B" fontSize="14" fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            >$</motion.text>
          </svg>
        )}
      </motion.div>

      {/* Tag */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[10px] text-blue-500 mb-1.5 block"
        style={{ fontWeight: 600, letterSpacing: "0.04em" }}
      >
        {c.tag.toUpperCase()}
      </motion.span>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-[15px] text-gray-800 mb-4"
        style={{ fontWeight: 700, lineHeight: 1.3 }}
      >
        {c.title}
      </motion.h3>

      {/* Tips list */}
      <div className="space-y-2.5 mb-5">
        {c.tips.map((tip, i) => (
          <motion.div
            key={tip}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="flex gap-2.5 items-start"
          >
            <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0 mt-1.5" />
            <span className="text-[12px] text-gray-500 leading-relaxed">{tip}</span>
          </motion.div>
        ))}
      </div>

      {/* Stat card */}
      {c.stat && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-[22px] text-blue-600 mb-0.5" style={{ fontWeight: 700 }}>
            {c.stat.number}
          </p>
          <p className="text-[11px] text-gray-500 leading-snug">{c.stat.label}</p>
        </motion.div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════
   Onboarding steps config
   ════════════════════════════════════════════════ */
const steps = [
  {
    id: "empresa",
    question: "¿Cómo se llama tu empresa?",
    hint: "Escribe el nombre tal como lo conocen tus clientes.",
    type: "text" as const,
    placeholder: "Ej: Panadería La Esperanza",
  },
  {
    id: "industria",
    question: "¿A qué se dedica tu negocio?",
    hint: "Elige la que mejor te represente.",
    type: "cards" as const,
    options: [
      { value: "comercio", label: "Comercio", desc: "Tienda fisica u online" },
      { value: "servicios", label: "Servicios", desc: "Consultoria, agencia, freelance" },
      { value: "salud", label: "Salud", desc: "Clinica, farmacia, bienestar" },
      { value: "educacion", label: "Educación", desc: "Escuela, cursos, formacion" },
      { value: "otro", label: "Otro", desc: "Mi negocio es diferente" },
    ],
  },
  {
    id: "tamaño",
    question: "¿Cuántas personas hay en tu equipo?",
    hint: "Incluye socios y colaboradores.",
    type: "cards" as const,
    options: [
      { value: "solo", label: "Solo yo", desc: "Emprendedor independiente" },
      { value: "pequeño", label: "2 — 10 personas", desc: "Equipo pequeño" },
      { value: "mediano", label: "11 — 50 personas", desc: "Empresa en crecimiento" },
    ],
  },
  {
    id: "problema",
    question: "¿Cuáles son tus principales retos?",
    hint: "Selecciona los que apliquen y cuéntanos más en tus palabras.",
    type: "problema" as const,
    prompts: [
      "No tengo presencia en internet",
      "Me cuesta conseguir clientes",
      "Quiero vender por internet",
      "Hago todo manual y pierdo tiempo",
    ],
  },
  {
    id: "contexto_actual",
    question: "¿Qué tienes actualmente?",
    hint: "Nos ayuda a entender tu punto de partida.",
    type: "contexto" as const,
    options: [
      { value: "ya_tengo", label: "Ya tengo algo", desc: "Mejorar o integrar" },
      { value: "idea", label: "Tengo una idea", desc: "Acelerar el proceso" },
      { value: "cero", label: "Empiezo de cero", desc: "Guiar desde el principio" },
    ],
  },
  {
    id: "presupuesto",
    question: "¿Cuánto podrías invertir?",
    hint: "Solo es una referencia, puedes saltar esta pregunta.",
    type: "cards" as const,
    optional: true,
    options: [
      { value: "inicial", label: "Menos de $5,000", desc: "Lo esencial para empezar" },
      { value: "profesional", label: "$5,000 — $20,000", desc: "Solución profesional" },
      { value: "avanzado", label: "Más de $20,000", desc: "Proyecto a medida" },
    ],
  },
];

/* ════════════════════════════════════════════════
   Helpers for results
   ════════════════════════════════════════════════ */
function getRecommendations(data: Record<string, string>, prompts: string[]) {
  const recs: { area: string; desc: string; priority: string }[] = [];

  if (prompts.some((p) => p.includes("presencia")) || prompts.some((p) => p.includes("clientes"))) {
    recs.push({ area: "Presencia digital", desc: "Página web profesional optimizada para que tus clientes te encuentren en Google y redes sociales.", priority: "Alta" });
  }
  if (prompts.some((p) => p.includes("vender"))) {
    recs.push({ area: "E-commerce", desc: "Tienda online con catálogo, carrito y pagos integrados para que vendas las 24 horas.", priority: "Alta" });
  }
  if (prompts.some((p) => p.includes("manual"))) {
    recs.push({ area: "Automatización", desc: "Automatiza facturación, agendamiento y seguimiento de clientes para ahorrar horas cada semana.", priority: "Media" });
  }
  if (recs.length === 0) {
    recs.push(
      { area: "Presencia digital", desc: "Página web profesional adaptada a tu industria y tus objetivos.", priority: "Alta" },
      { area: "Estrategia de captación", desc: "Atrae nuevos clientes con SEO, redes sociales y contenido relevante.", priority: "Media" },
    );
  }
  // Always add branding
  recs.push({ area: "Identidad de marca", desc: "Logo, colores y estilo visual que reflejen la calidad de tu negocio.", priority: "Media" });
  return recs;
}

function getInvestmentLabel(val: string) {
  if (val === "inicial") return "Menos de $5,000";
  if (val === "profesional") return "$5,000 — $20,000";
  if (val === "avanzado") return "Más de $20,000";
  return "Por definir";
}

function getIndustriaLabel(val: string) {
  const map: Record<string, string> = { comercio: "Comercio", servicios: "Servicios", salud: "Salud", educacion: "Educación", otro: "Otro" };
  return map[val] || val;
}

function getContextoActualLabel(val: string) {
  const map: Record<string, string> = {
    ya_tengo: "Ya tengo algo",
    idea: "Tengo una idea",
    cero: "Empiezo de cero",
  };
  return map[val] || val || "No especificado";
}

async function uploadContextoArchivos(
  client: SupabaseClient,
  submissionId: string,
  files: File[],
): Promise<ContextoArchivoMeta[]> {
  const uploaded: ContextoArchivoMeta[] = [];
  for (const file of files) {
    const safe = sanitizeStorageFileName(file.name);
    const path = `${submissionId}/${Date.now()}-${safe}`;
    const { error } = await client.storage.from("onboarding-attachments").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });
    if (error) throw error;
    const { data: pub } = client.storage.from("onboarding-attachments").getPublicUrl(path);
    uploaded.push({ path, name: file.name, size: file.size, url: pub.publicUrl });
  }
  return uploaded;
}

/* ════════════════════════════════════════════════
   Main Onboarding Component
   ════════════════════════════════════════════════ */
export function Onboarding({ onClose }: { onClose: () => void }) {
  const initialDraft = useMemo(() => readOnboardingDraft(), []);
  const total = steps.length;

  const [currentStep, setCurrentStep] = useState(() => clampStepIndex(initialDraft?.currentStep ?? 0, total));
  const [data, setData] = useState<Record<string, string>>(() => initialDraft?.data ?? {});
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>(() => initialDraft?.selectedPrompts ?? []);
  const [extraDetail, setExtraDetail] = useState(() => initialDraft?.extraDetail ?? "");
  const [contextoFiles, setContextoFiles] = useState<File[]>([]);
  const [contextoArchivosMeta, setContextoArchivosMeta] = useState<ContextoArchivoMeta[]>(() => initialDraft?.contextoArchivosMeta ?? []);
  const [otroText, setOtroText] = useState(() => initialDraft?.otroText ?? "");
  const [phase, setPhase] = useState<"form" | "processing" | "results">(() => initialDraft?.phase ?? "form");
  const [direction, setDirection] = useState(1);
  const [processingStep, setProcessingStep] = useState(() => initialDraft?.processingStep ?? 0);
  const [aiDiagnosis, setAiDiagnosis] = useState<AIDiagnosis | null>(() => initialDraft?.aiDiagnosis ?? null);

  const STORAGE_KEY = "onboarding_submission_id_v1";
  /** Refleja el id de fila en Supabase de forma síncrona (evita carreras tras insert antes del re-render). */
  const onboardingSubmissionIdRef = useRef<string | null>(null);
  const [onboardingSubmissionId, setOnboardingSubmissionId] = useState<string | null>(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      onboardingSubmissionIdRef.current = v;
      return v;
    } catch {
      onboardingSubmissionIdRef.current = null;
      return null;
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  const supabase = useMemo(() => {
    const projectId = import.meta.env.VITE_PROJECT_ID as string | undefined;
    const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)
      || (projectId ? `https://${projectId}.supabase.co` : undefined);
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
    if (!url || !key) return null;

    return createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }, []);

  useEffect(() => {
    try {
      if (onboardingSubmissionId) localStorage.setItem(STORAGE_KEY, onboardingSubmissionId);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors (e.g., in restricted environments)
    }
  }, [onboardingSubmissionId]);

  const step = steps[currentStep];
  const value = data[step?.id] || "";

  useEffect(() => {
    try {
      const draft: OnboardingDraftV1 = {
        v: 1,
        currentStep: clampStepIndex(currentStep, total),
        data,
        selectedPrompts,
        extraDetail,
        otroText,
        phase: phase === "results" ? "results" : "form",
        aiDiagnosis,
        processingStep,
        contextoArchivosMeta,
      };
      localStorage.setItem(ONBOARDING_DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // ignore storage errors
    }
  }, [
    aiDiagnosis,
    contextoArchivosMeta,
    currentStep,
    data,
    extraDetail,
    otroText,
    phase,
    processingStep,
    selectedPrompts,
    total,
  ]);

  const buildAnswersRaw = (overrides?: Record<string, unknown>) => {
    const base: Record<string, unknown> = { ...data };
    return { ...base, ...(overrides || {}) };
  };

  const persistOnboarding = async (payload: {
    current_step: number;
    completed_at?: string | null;
    empresa?: string | null;
    industria?: string | null;
    industria_otro?: string | null;
    tamano?: string | null;
    problema?: string | null;
    presupuesto?: string | null;
    answers_raw: Record<string, unknown>;
    clearLocalStorageOnSuccess?: boolean;
  }): Promise<string | null> => {
    if (!supabase) {
      console.warn("Supabase env vars missing; skipping persistence.");
      return null;
    }

    const saveData: Record<string, unknown> = {
      current_step: payload.current_step,
      completed_at: payload.completed_at ?? null,
      empresa: payload.empresa ?? undefined,
      industria: payload.industria ?? undefined,
      industria_otro: payload.industria_otro ?? undefined,
      tamano: payload.tamano ?? undefined,
      problema: payload.problema ?? undefined,
      presupuesto: payload.presupuesto ?? undefined,
      answers_raw: payload.answers_raw,
    };

    // Remove undefined keys so we don't overwrite existing columns with nulls.
    Object.keys(saveData).forEach((k) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((saveData as any)[k] === undefined) delete (saveData as any)[k];
    });

    try {
      setIsSaving(true);

      const activeId = onboardingSubmissionIdRef.current;

      if (!activeId) {
        const insert = await supabase
          .from("onboarding_submissions")
          .insert(saveData)
          .select("id")
          .single();

        if (insert.error) throw insert.error;

        const newId = insert.data.id as string;
        onboardingSubmissionIdRef.current = newId;
        setOnboardingSubmissionId(newId);
        if (payload.clearLocalStorageOnSuccess) {
          onboardingSubmissionIdRef.current = null;
          setOnboardingSubmissionId(null);
        }
        return payload.clearLocalStorageOnSuccess ? null : newId;
      } else {
        const update = await supabase
          .from("onboarding_submissions")
          .update(saveData)
          .eq("id", activeId);

        if (update.error) throw update.error;
        if (payload.clearLocalStorageOnSuccess) {
          onboardingSubmissionIdRef.current = null;
          setOnboardingSubmissionId(null);
        }
        return payload.clearLocalStorageOnSuccess ? null : activeId;
      }
    } catch (err) {
      console.error("Failed to persist onboarding answers:", err);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const canContinue = () => {
    if (step.type === "problema") return selectedPrompts.length > 0 || extraDetail.trim().length > 0;
    if (step.type === "contexto") return isValidContextoActual(value);
    if (step.optional) return true;
    return value.trim().length > 0;
  };

  const processingSteps = [
    "Analizando tu industria...",
    "Evaluando oportunidades digitales...",
    "Generando recomendaciones...",
    "Preparando tu diagnóstico...",
  ];

  const buildFallbackDiagnosis = (answers: Record<string, string>, prompts: string[]): AIDiagnosis => {
    const fallbackRecs = getRecommendations(answers, prompts);
    const top = fallbackRecs[0];
    return {
      summary: `Basándonos en tu perfil como empresa de ${getIndustriaLabel(answers.industria)}, identificamos ${fallbackRecs.length} áreas clave donde podemos ayudarte a crecer digitalmente.`,
      recommendations: fallbackRecs.map((r) => ({ area: r.area, desc: r.desc, priority: r.priority as "Alta" | "Media" })),
      nextSteps: [
        "Agendas una llamada gratuita de 30 min",
        "Revisamos juntos este diagnóstico",
        "Te enviamos una propuesta sin compromiso",
      ],
      solutionFlow: buildFallbackSolutionFlow(fallbackRecs),
      sugerenciaConsultoria: top
        ? `Empezar por ${top.area}: ${top.desc.slice(0, 200)}${top.desc.length > 200 ? "…" : ""}`
        : "Define con el equipo un primer entregable pequeño (web o automatización) alineado a tu presupuesto.",
      source: "fallback",
    };
  };

  const generateDiagnosisWithAI = async (
    answers: Record<string, string>,
    prompts: string[],
    filesMeta: ContextoArchivoMeta[],
  ): Promise<{ diagnosis: AIDiagnosis; rawResponseText?: string }> => {
    const geminiKey = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim();
    const openaiKey =
      ((import.meta.env.VITE_OPENAI_API_KEY as string | undefined)
        || (import.meta.env.OPENAI_API_KEY as string | undefined))?.trim();

    const archivosBlock =
      filesMeta.length > 0
        ? filesMeta.map((f, i) => `  ${i + 1}. ${f.name} (${f.size} bytes) — ${f.url || "sin URL pública"}`).join("\n")
        : "  (ningún archivo adjunto)";

    const prompt = buildDiagnosisUserPrompt([
      "Genera un diagnóstico para una consultora digital en español.",
      "",
      "Datos del cliente:",
      `- Empresa: ${answers.empresa || "No especificado"}`,
      `- Industria: ${getIndustriaLabel(answers.industria || "otro")}`,
      `- Tamaño: ${answers["tamaño"] || "No especificado"}`,
      `- Problema: ${answers.problema || "No especificado"}`,
      `- Presupuesto: ${getInvestmentLabel(answers.presupuesto || "")}`,
      `- Retos seleccionados: ${prompts.join(" | ") || "No especificado"}`,
      `- Punto de partida: ${getContextoActualLabel(answers.contexto_actual || "")}`,
      `- Detalle de contexto: ${answers.contexto_detalle?.trim() || "No especificado"}`,
      "",
      "Documentación / archivos opcionales (solo metadatos; el modelo no ve el binario):",
      archivosBlock,
    ]);

    try {
      if (geminiKey) {
        const { diagnosis, rawResponseText } = await fetchGeminiDiagnosis(prompt, geminiKey);
        return { diagnosis, rawResponseText };
      }
      if (openaiKey) {
        const { diagnosis, rawResponseText } = await fetchOpenAIDiagnosis(prompt, openaiKey);
        return { diagnosis, rawResponseText };
      }
    } catch (err) {
      console.error("AI diagnosis failed, using fallback:", err);
    }

    return { diagnosis: buildFallbackDiagnosis(answers, prompts) };
  };

  const runProcessingAnimation = () =>
    new Promise<void>((resolve) => {
      let s = 0;
      const interval = setInterval(() => {
        s++;
        if (s >= processingSteps.length) {
          clearInterval(interval);
          setTimeout(() => resolve(), 600);
        } else {
          setProcessingStep(s);
        }
      }, 900);
    });

  const persistDiagnosisResult = async (
    diagnosis: AIDiagnosis,
    answersSnapshot: Record<string, string>,
    promptsSnapshot: string[],
    rawResponseText?: string,
  ) => {
    const problemaCombined =
      answersSnapshot.problema?.trim()
      || [...promptsSnapshot, extraDetail].filter(Boolean).join("; ");

    await persistOnboarding({
      current_step: total,
      completed_at: new Date().toISOString(),
      empresa: answersSnapshot.empresa?.trim() || null,
      industria: answersSnapshot.industria?.trim() || null,
      industria_otro: answersSnapshot.industria_otro?.trim() || null,
      tamano: answersSnapshot["tamaño"]?.trim() || null,
      problema: problemaCombined || null,
      presupuesto: answersSnapshot.presupuesto?.trim() || null,
      answers_raw: buildAnswersRaw({
        ...answersSnapshot,
        problema: problemaCombined,
        ai_diagnosis: diagnosis,
        ...(contextoArchivosMeta.length > 0 ? { contexto_archivos: contextoArchivosMeta } : {}),
        ...(diagnosis.source === "gemini" && rawResponseText
          ? { gemini_raw_response: rawResponseText }
          : {}),
        ...(diagnosis.source === "openai" && rawResponseText
          ? { openai_raw_response: rawResponseText }
          : {}),
      }),
      clearLocalStorageOnSuccess: true,
    });
  };

  const startProcessing = () => {
    setPhase("processing");
    setProcessingStep(0);

    const answersSnapshot = { ...data };
    const promptsSnapshot = [...selectedPrompts];

    void (async () => {
      const [{ diagnosis, rawResponseText }] = await Promise.all([
        generateDiagnosisWithAI(answersSnapshot, promptsSnapshot, contextoArchivosMeta),
        runProcessingAnimation(),
      ]);

      await persistDiagnosisResult(diagnosis, answersSnapshot, promptsSnapshot, rawResponseText);
      setAiDiagnosis(diagnosis);
      setPhase("results");
    })();
  };

  const resetOnboarding = () => {
    const shouldReset = window.confirm(
      "¿Seguro que deseas reiniciar el diagnóstico? Se perderá el avance guardado.",
    );
    if (!shouldReset) return;

    clearOnboardingDraftStorage();
    setCurrentStep(0);
    setData({});
    setSelectedPrompts([]);
    setExtraDetail("");
    setContextoFiles([]);
    setContextoArchivosMeta([]);
    setOtroText("");
    setPhase("form");
    setDirection(1);
    setProcessingStep(0);
    setAiDiagnosis(null);
    onboardingSubmissionIdRef.current = null;
    setOnboardingSubmissionId(null);
  };

  const goNext = async () => {
    const isLastStep = currentStep >= total - 1;
    const nextStepNumber = isLastStep ? total : Math.min(currentStep + 2, total);

    if (step.id === "contexto_actual") {
      const detalle = data.contexto_detalle?.trim() || "";
      const baseOverrides: Record<string, unknown> = {
        contexto_actual: data.contexto_actual,
        contexto_detalle: detalle,
      };

      const sid = await persistOnboarding({
        current_step: nextStepNumber,
        completed_at: isLastStep ? new Date().toISOString() : null,
        answers_raw: buildAnswersRaw(baseOverrides),
        clearLocalStorageOnSuccess: false,
      });

      let archivos: ContextoArchivoMeta[] = [];
      if (contextoFiles.length > 0 && supabase && sid) {
        try {
          archivos = await uploadContextoArchivos(supabase, sid, contextoFiles);
          setContextoArchivosMeta(archivos);
        } catch (e) {
          console.error("Contexto file upload failed:", e);
        }
        await persistOnboarding({
          current_step: nextStepNumber,
          completed_at: isLastStep ? new Date().toISOString() : null,
          answers_raw: buildAnswersRaw({ ...baseOverrides, contexto_archivos: archivos }),
          clearLocalStorageOnSuccess: false,
        });
      }
      setContextoFiles([]);

      if (currentStep < total - 1) {
        setDirection(1);
        setCurrentStep((s) => s + 1);
      } else {
        startProcessing();
      }
      return;
    }

    // Step-specific fields to store in Supabase.
    let fields: {
      empresa?: string | null;
      industria?: string | null;
      industria_otro?: string | null;
      tamano?: string | null;
      problema?: string | null;
      presupuesto?: string | null;
    } = {};

    // Ensure our persistence uses the newest values (React state updates are async).
    let answersOverrides: Record<string, unknown> = {};

    if (step.id === "empresa") {
      fields.empresa = data.empresa ?? null;
      answersOverrides = {};
    }

    if (step.id === "industria" && value === "otro") {
      fields.industria = "otro";
      fields.industria_otro = data.industria_otro ?? otroText ?? null;
    }

    if (step.type === "problema") {
      const combined = [...selectedPrompts, extraDetail].filter(Boolean).join("; ");
      fields.problema = combined;
      answersOverrides.problema = combined;
      setData({ ...data, problema: combined });
    }

    if (step.id === "presupuesto") {
      fields.presupuesto = value.trim() ? value : null;
    }

    await persistOnboarding({
      current_step: nextStepNumber,
      completed_at: isLastStep ? new Date().toISOString() : null,
      ...fields,
      answers_raw: buildAnswersRaw(answersOverrides),
      clearLocalStorageOnSuccess: false,
    });

    if (currentStep < total - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    } else {
      startProcessing();
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  const handleCardSelect = (val: string) => {
    if (val === "otro" && step.id === "industria") {
      setData({ ...data, [step.id]: val });
      return; // Don't auto-advance, let user type
    }

    if (step.id === "contexto_actual") {
      setData({ ...data, [step.id]: val });
      return;
    }

    setData({ ...data, [step.id]: val });

    const isLastStep = currentStep >= total - 1;
    const nextStepNumber = isLastStep ? total : Math.min(currentStep + 2, total);
    const answersOverrides: Record<string, unknown> = { [step.id]: val };

    // Map step.id (which includes "tamaño") to DB column "tamano".
    const payloadFields: {
      empresa?: string | null;
      industria?: string | null;
      industria_otro?: string | null;
      tamano?: string | null;
      problema?: string | null;
      presupuesto?: string | null;
    } = {};

    if (step.id === "industria") {
      payloadFields.industria = val;
      payloadFields.industria_otro = null;
    }

    if (step.id === "tamaño") {
      payloadFields.tamano = val;
      // Keep the accented key for answers_raw.
      answersOverrides["tamaño"] = val;
    }

    if (step.id === "presupuesto") {
      payloadFields.presupuesto = val;
    }

    void (async () => {
      // No limpiar el id aquí: el último paso debe seguir enlazado a la misma fila hasta guardar el diagnóstico.
      await persistOnboarding({
        current_step: nextStepNumber,
        completed_at: isLastStep ? new Date().toISOString() : null,
        ...payloadFields,
        answers_raw: buildAnswersRaw(answersOverrides),
        clearLocalStorageOnSuccess: false,
      });

      setTimeout(() => {
        setDirection(1);
        if (currentStep < total - 1) {
          setCurrentStep((s) => s + 1);
        } else {
          startProcessing();
        }
      }, 350);
    })();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canContinue() && step.type === "text" && !isSaving) {
      e.preventDefault();
      void goNext();
    }
  };

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, y: d > 0 ? 30 : -30 }),
    center: { opacity: 1, y: 0 },
    exit: (d: number) => ({ opacity: 0, y: d > 0 ? -30 : 30 }),
  };

  const recommendations = aiDiagnosis?.recommendations ?? getRecommendations(data, selectedPrompts).map((rec) => ({
    ...rec,
    priority: rec.priority === "Alta" ? "Alta" : "Media",
  }));
  const summaryText = aiDiagnosis?.summary
    ?? `Basándonos en tu perfil como empresa de ${getIndustriaLabel(data.industria)}, identificamos ${recommendations.length} áreas clave donde podemos ayudarte a crecer digitalmente.`;
  const nextSteps = aiDiagnosis?.nextSteps ?? [
    "Agendas una llamada gratuita de 30 min",
    "Revisamos juntos este diagnóstico",
    "Te enviamos una propuesta sin compromiso",
  ];

  const solutionFlowForUi: SolutionFlowData =
    aiDiagnosis?.solutionFlow ?? buildFallbackSolutionFlow(recommendations);

  return (
    <div className="flex flex-col h-full">
      {/* Main split content */}
      <div className="flex-1 flex overflow-hidden min-h-0 h-full">
        {/* LEFT 65% — header, progress, form, buttons */}
        <div className="flex-[65] flex flex-col min-h-0">
          {/* Top bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between gap-2 px-4 sm:px-8 md:px-10 py-3 sm:py-4 min-w-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 border-b border-gray-100/80">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
              <button
                type="button"
                onClick={resetOnboarding}
                className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                style={{ fontWeight: 500 }}
              >
                Reiniciar diagnóstico
              </button>
              {phase === "form" && (
                <>
                  
                  
                </>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 justify-end">
              {phase === "form" && (
                <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto max-w-[min(100%,11rem)] sm:max-w-none py-0.5 pr-1 -mr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {steps.map((_, i) => (
                    <span
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 rounded-full text-[9px] sm:text-[10px] flex items-center justify-center transition-all duration-300 ${
                        i < currentStep
                          ? "bg-blue-600 text-white"
                          : i === currentStep
                            ? "bg-blue-100 text-blue-600 ring-2 ring-blue-200"
                            : "bg-gray-100 text-gray-400"
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form content — results scroll inside fixed-height modal */}
          <div
            className={`flex min-h-0 flex-1 flex-col px-4 sm:px-8 md:px-10 ${
              phase === "results"
                ? "overflow-hidden pt-1"
                : "justify-start sm:justify-center overflow-y-auto overscroll-contain pb-2 pt-2"
            }`}
          >
            <div
              className={`mx-auto w-full min-h-0 ${
                phase === "results"
                  ? "max-h-full flex-1 overflow-y-auto overscroll-contain py-2 pb-3 w-full max-w-2xl [scrollbar-width:thin]"
                  : `py-4 sm:py-6 w-full max-w-sm min-w-0 pb-4`
              }`}
              onKeyDown={handleKeyDown}
            >
              <button
                type="button"
                onClick={resetOnboarding}
                className="sm:hidden inline-flex mb-3 text-[12px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-gray-50"
                style={{ fontWeight: 500 }}
              >
                Reiniciar diagnóstico
              </button>
              <AnimatePresence mode="wait" custom={direction}>
                {/* ─── FORM ─── */}
                {phase === "form" && (
                  <motion.div
                    key={step.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <p className="text-[11px] text-gray-400 mb-1">
                      Paso {currentStep + 1} de {total}
                      {step.optional && <span className="text-blue-400 ml-1.5">— Opcional</span>}
                    </p>
                    <h2 className="text-xl sm:text-2xl text-gray-900 mb-1.5" style={{ fontWeight: 700, lineHeight: 1.25 }}>
                      {step.question}
                    </h2>
                    <p className="text-[13px] text-gray-400 mb-5">{step.hint}</p>

                    {/* Text input */}
                    {step.type === "text" && (
                      <div>
                        <input
                          type="text"
                          autoFocus
                          value={value}
                          onChange={(e) => setData({ ...data, [step.id]: e.target.value })}
                          placeholder={step.placeholder}
                          className="w-full bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-xl outline-none text-[15px] text-gray-900 px-4 py-3 transition-all placeholder:text-gray-300"
                        />
                        {value.length > 0 && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-gray-300 mt-2">
                            Presiona Enter o Continuar
                          </motion.p>
                        )}
                      </div>
                    )}

                    {/* Card select */}
                    {step.type === "cards" && (
                      <div className="space-y-2">
                        {step.options!.map((opt, i) => (
                          <motion.button
                            key={opt.value}
                            type="button"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => handleCardSelect(opt.value)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer border ${
                              value === opt.value
                                ? "bg-blue-600 border-blue-600 shadow-[0_2px_16px_rgba(37,99,235,0.2)]"
                                : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
                            }`}
                          >
                            <span className={`text-[14px] block ${value === opt.value ? "text-white" : "text-gray-800"}`} style={{ fontWeight: 600 }}>
                              {opt.label}
                            </span>
                            <span className={`text-[12px] block mt-0.5 ${value === opt.value ? "text-blue-100" : "text-gray-400"}`}>
                              {opt.desc}
                            </span>
                          </motion.button>
                        ))}

                        {/* "Otro" text input */}
                        {value === "otro" && step.id === "industria" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.25 }}
                            className="pt-2"
                          >
                            <input
                              type="text"
                              autoFocus
                              value={otroText}
                              onChange={(e) => {
                                setOtroText(e.target.value);
                                setData({ ...data, industria_otro: e.target.value });
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && otroText.trim().length > 0) {
                                  e.preventDefault();
                                  void goNext();
                                }
                              }}
                              placeholder="Ej: Restaurante, Inmobiliaria, Logística..."
                              className="w-full bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-xl outline-none text-[15px] text-gray-900 px-4 py-3 transition-all placeholder:text-gray-300"
                            />
                            {otroText.trim().length > 0 && (
                              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-gray-300 mt-2">
                                Presiona Enter o Continuar
                              </motion.p>
                            )}
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Problema — guided */}
                    {step.type === "problema" && (
                      <div>
                        <div className="space-y-2 mb-4">
                          {step.prompts!.map((prompt, i) => {
                            const isSelected = selectedPrompts.includes(prompt);
                            return (
                              <motion.button
                                key={prompt}
                                type="button"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                onClick={() => {
                                  setSelectedPrompts((prev) =>
                                    isSelected ? prev.filter((p) => p !== prompt) : [...prev, prompt]
                                  );
                                }}
                                className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer border flex items-center gap-3 ${
                                  isSelected ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200 hover:border-blue-200"
                                }`}
                              >
                                <span className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center shrink-0 transition-all ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                                  {isSelected && (
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                      <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </span>
                                <span className={`text-[13px] ${isSelected ? "text-blue-700" : "text-gray-600"}`} style={{ fontWeight: 500 }}>
                                  {prompt}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                          <p className="text-[12px] text-gray-400 mb-1.5">¿Algo más que quieras contarnos?</p>
                          <textarea
                            rows={2}
                            value={extraDetail}
                            onChange={(e) => setExtraDetail(e.target.value)}
                            placeholder="Ej: También necesito que mis clientes puedan reservar citas..."
                            className="w-full bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-xl outline-none text-[13px] text-gray-900 p-3 transition-all placeholder:text-gray-300 resize-none"
                          />
                        </motion.div>
                      </div>
                    )}

                    {step.type === "contexto" && step.options && (
                      <div>
                        <div className="space-y-2 mb-4">
                          {step.options.map((opt, i) => {
                            const selected = value === opt.value;
                            return (
                              <motion.button
                                key={opt.value}
                                type="button"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => handleCardSelect(opt.value)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer border ${
                                  selected
                                    ? "bg-blue-600 border-blue-600 shadow-[0_2px_16px_rgba(37,99,235,0.2)]"
                                    : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
                                }`}
                              >
                                <span className={`text-[14px] block ${selected ? "text-white" : "text-gray-800"}`} style={{ fontWeight: 600 }}>
                                  {opt.label}
                                </span>
                                <span className={`text-[12px] block mt-0.5 ${selected ? "text-blue-100" : "text-gray-400"}`}>
                                  {opt.desc}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-4">
                          <p className="text-[12px] text-gray-500 mb-1.5">Cuéntanos qué tienes</p>
                          <textarea
                            rows={3}
                            value={data.contexto_detalle || ""}
                            onChange={(e) => setData({ ...data, contexto_detalle: e.target.value })}
                            placeholder="Describe brevemente sitio web, redes, sistemas que usas..."
                            className="w-full bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-xl outline-none text-[13px] text-gray-900 p-3 transition-all placeholder:text-gray-300 resize-none"
                          />
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                          <p className="text-[12px] text-gray-500 mb-1.5">Archivos opcionales (diseños, wireframes, etc.)</p>
                          <input
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx,.zip,.ppt,.pptx,.txt"
                            onChange={(e) => setContextoFiles(Array.from(e.target.files || []))}
                            className="w-full text-[13px] text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-[12px] file:bg-blue-50 file:text-blue-700 file:font-medium cursor-pointer"
                          />
                          {contextoFiles.length > 0 && (
                            <ul className="mt-2 space-y-1 text-[11px] text-gray-500">
                              {contextoFiles.map((f, i) => (
                                <li key={`${f.name}-${i}-${f.size}`}>{f.name}</li>
                              ))}
                            </ul>
                          )}
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ─── PROCESSING ─── */}
                {phase === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <motion.svg
                      width="48" height="48" viewBox="0 0 48 48" fill="none"
                      className="mx-auto mb-6"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <motion.path
                        d="M32 8L38 14L18 34L10 36L12 28Z"
                        stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                    </motion.svg>

                    <h2 className="text-xl text-gray-900 mb-2" style={{ fontWeight: 700 }}>
                      Analizando tu caso
                    </h2>
                    <p className="text-[13px] text-gray-500 mb-6">
                      Preparando recomendaciones para {data.empresa || "tu empresa"}
                    </p>

                    {/* Step-by-step progress */}
                    <div className="max-w-[220px] mx-auto space-y-2 text-left mb-6">
                      {processingSteps.map((label, i) => (
                        <motion.div
                          key={label}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: i <= processingStep ? 1 : 0.3, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2.5"
                        >
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                            i < processingStep ? "bg-green-500" : i === processingStep ? "bg-blue-500" : "bg-gray-200"
                          }`}>
                            {i < processingStep ? (
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            ) : i === processingStep ? (
                              <motion.div
                                className="w-1.5 h-1.5 bg-white rounded-full"
                                animate={{ scale: [1, 1.4, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                              />
                            ) : null}
                          </span>
                          <span className={`text-[12px] ${i <= processingStep ? "text-gray-700" : "text-gray-400"}`} style={{ fontWeight: i === processingStep ? 600 : 400 }}>
                            {label}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="w-48 mx-auto">
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-600 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3.6, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ─── RESULTS (Bento Grid) ─── */}
                {phase === "results" && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3 shrink-0">
                      
                      <div>
                        <h2 className="text-[17px] text-gray-900 leading-tight" style={{ fontWeight: 700 }}>
                          Tu diagnóstico está listo
                        </h2>
                        <p className="text-[11px] text-gray-400 truncate">
                          {data.empresa || "Tu empresa"} — {getIndustriaLabel(data.industria)}
                        </p>
                        {aiDiagnosis?.source && (
                          <p className="text-[10px] text-blue-500/90 mt-1" style={{ fontWeight: 500 }}>
                            {aiDiagnosis.source === "gemini" && "Informe basado en Gemini (guardado en tu registro)"}
                            {aiDiagnosis.source === "openai" && "Informe basado en OpenAI (guardado en tu registro)"}
                            {aiDiagnosis.source === "fallback" && "Informe base (IA no disponible o error de red)"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                      {/* Row 1: Summary (span 2) + Investment (span 1) */}
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="col-span-1 sm:col-span-2 lg:col-span-2 bg-white rounded-xl p-3 border border-gray-100 min-w-0"
                      >
                        <p className="text-[9px] text-blue-500 mb-1" style={{ fontWeight: 600, letterSpacing: "0.04em" }}>RESUMEN</p>
                        <p className="text-[11px] text-gray-600 leading-snug line-clamp-6 sm:line-clamp-[8]">{summaryText}</p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="col-span-1 bg-blue-50 rounded-xl p-3 border border-blue-100 flex flex-col justify-between min-h-0 min-w-0"
                      >
                        <p className="text-[9px] text-blue-500 mb-0.5" style={{ fontWeight: 600, letterSpacing: "0.04em" }}>INVERSIÓN</p>
                        <p className="text-[14px] text-blue-700 leading-tight" style={{ fontWeight: 700 }}>
                          {getInvestmentLabel(data.presupuesto)}
                        </p>
                      </motion.div>

                      {aiDiagnosis?.sugerenciaConsultoria?.trim() && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.38 }}
                          className="col-span-1 sm:col-span-2 lg:col-span-3 rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50/90 to-white p-3 min-w-0"
                        >
                          <p
                            className="text-[9px] text-emerald-700 mb-1"
                            style={{ fontWeight: 600, letterSpacing: "0.04em" }}
                          >
                            SUGERENCIA CLAVE
                          </p>
                          <p className="text-[11px] text-gray-700 leading-snug">{aiDiagnosis.sugerenciaConsultoria}</p>
                        </motion.div>
                      )}

                      {/* Row 2: Recommendations */}
                      {recommendations.map((rec, i) => (
                        <motion.div
                          key={rec.area}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + i * 0.08 }}
                          className="col-span-1 bg-white rounded-xl p-2.5 border border-gray-100 flex flex-col min-h-0 min-w-0"
                        >
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-full self-start mb-1 ${
                            rec.priority === "Alta"
                              ? "bg-orange-50 text-orange-600 border border-orange-100"
                              : "bg-blue-50 text-blue-500 border border-blue-100"
                          }`} style={{ fontWeight: 600 }}>
                            {rec.priority}
                          </span>
                          <h4 className="text-[12px] text-gray-900 mb-0.5 leading-tight line-clamp-2" style={{ fontWeight: 600 }}>{rec.area}</h4>
                          <p className="text-[10px] text-gray-500 leading-snug flex-1 line-clamp-4">{rec.desc}</p>
                        </motion.div>
                      ))}

                      {/* Row 3: Next steps (span 2) + CTA (span 1) */}
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="col-span-1 sm:col-span-2 lg:col-span-2 bg-white rounded-xl p-3 border border-gray-100 min-w-0"
                      >
                        <p className="text-[9px] text-blue-500 mb-1.5" style={{ fontWeight: 600, letterSpacing: "0.04em" }}>¿QUÉ SIGUE?</p>
                        <div className="space-y-1.5">
                          {nextSteps.map((text, i) => (
                            <motion.div
                              key={`${i}-${text}`}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + i * 0.1 }}
                              className="flex gap-1.5 items-start"
                            >
                              <span className="w-[16px] h-[16px] rounded-full bg-blue-600 text-white text-[8px] flex items-center justify-center shrink-0 mt-0.5" style={{ fontWeight: 700 }}>
                                {i + 1}
                              </span>
                              <span className="text-[10px] text-gray-600 leading-snug">{text}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.75 }}
                        className="col-span-1 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-3 flex flex-col justify-between text-white min-h-0 min-w-0"
                      >
                        <p className="text-[10px] text-blue-200 mb-2" style={{ fontWeight: 600, letterSpacing: "0.04em" }}>ACCIÓN</p>
                        <div>
                          <a
                            href={JERS_CAL_30MIN_BOOKING_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-white text-blue-600 py-2 rounded-lg text-[12px] hover:bg-blue-50 transition-colors text-center mb-1.5"
                            style={{ fontWeight: 600 }}
                          >
                            Agendar llamada
                          </a>
                          <button
                            type="button"
                            className="w-full text-blue-200 py-1 text-[10px] hover:text-white transition-colors cursor-pointer"
                            style={{ fontWeight: 500 }}
                          >
                            Enviar por email
                          </button>
                        </div>
                      </motion.div>
                    </div>

                    <SolutionFlowProposal flow={solutionFlowForUi} />

                    {/* Bottom */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between mt-4"
                    >
                      <button
                        onClick={onClose}
                        className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer text-left"
                        style={{ fontWeight: 500 }}
                      >
                        ← Volver al inicio
                      </button>
                      <p className="text-[10px] text-gray-300 sm:text-right">
                        Sin compromiso — Tu información es confidencial.
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom nav */}
          {phase === "form" && (
            <div className="sticky bottom-0 z-20 px-4 sm:px-8 md:px-10 py-3 sm:py-3.5 shrink-0 border-t border-gray-100/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={currentStep === 0 ? onClose : goBack}
                  className="text-[13px] text-gray-500 hover:text-gray-700 transition-colors cursor-pointer px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 w-full sm:w-auto text-center sm:text-left"
                  style={{ fontWeight: 500 }}
                >
                  {currentStep === 0 ? "Cancelar" : "Anterior"}
                </button>
                <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
                  {step.optional && (
                    <button
                      onClick={() => void goNext()}
                      className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer px-3 py-2"
                      style={{ fontWeight: 500 }}
                    >
                      Saltar
                    </button>
                  )}
                  {(step.type === "text" || step.type === "problema" || step.type === "contexto") && (
                    <button
                      onClick={() => void goNext()}
                      disabled={!canContinue() || isSaving}
                      className={`text-[13px] px-5 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                        canContinue()
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-100 text-gray-300 cursor-not-allowed"
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {currentStep === total - 1 ? "Ver diagnóstico" : "Continuar"}
                    </button>
                  )}
                  {value === "otro" && step.id === "industria" && (
                    <button
                      onClick={() => void goNext()}
                      disabled={otroText.trim().length === 0 || isSaving}
                      className={`text-[13px] px-5 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                        otroText.trim().length > 0
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-100 text-gray-300 cursor-not-allowed"
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      Continuar
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT 35% — Tips only (hidden on mobile & results) */}
        {phase !== "results" && (
          <div className="hidden lg:flex flex-[35] bg-[#FAFBFC] rounded-tr-2xl rounded-br-2xl items-center justify-center px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase === "form" ? step?.id : "processing"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {phase === "form" && <TipPanel stepId={step.id} />}
                {phase === "processing" && (
                  <div className="text-center px-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-2 border-gray-200 border-t-blue-600 rounded-full mx-auto mb-4"
                    />
                    <p className="text-[13px] text-gray-500" style={{ fontWeight: 500 }}>Preparando tu diagnóstico</p>
                    <p className="text-[11px] text-gray-400 mt-1">Esto toma solo unos segundos</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}