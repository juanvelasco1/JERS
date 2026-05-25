import { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";

type BillingPeriod = "monthly" | "annual";

const ANNUAL_DISCOUNT = 0.15;

type Plan = {
  id: string;
  name: string;
  subtitle: string;
  monthlyCop: number;
  features: string[];
  cta: string;
  variant: "default" | "featured" | "corporate";
  revenueShare?: string;
};

const PLANS: Plan[] = [
  {
    id: "starter-mvp",
    name: "Starter MVP",
    subtitle: "Ideal para validación temprana",
    monthlyCop: 480_000,
    features: [
      "Orquestación básica de canales",
      "Auditoría mensual UX/UI",
      "Soporte por tickets",
      "1 iteración de diseño al mes",
      "Hosting básico incluido",
    ],
    cta: "Validar MVP",
    variant: "default",
  },
  {
    id: "co-growth",
    name: "Co-Growth",
    subtitle: "Crecemos juntos",
    monthlyCop: 850_000,
    revenueShare: "+ 8% sobre ingresos incrementales",
    features: [
      "Service design profundo",
      "Optimización continua de embudos",
      "Conexión automatizada GA4/Stripe",
      "Horas sprint ágil prioritarias",
      "Sesiones estratégicas mensuales",
      "A/B testing y CRO avanzado",
    ],
    cta: "Iniciar Alianza Co-Growth",
    variant: "featured",
  },
  {
    id: "corporate-squad",
    name: "Corporate Squad",
    subtitle: "Transformación empresarial",
    monthlyCop: 3_800_000,
    features: [
      "Equipo de desarrollo dedicado",
      "Integración avanzada de IA",
      "Arquitectura personalizada",
      "Acuerdo SLA personalizado",
      "Consultor asignado 24/7",
      "Workshops trimestrales presenciales",
    ],
    cta: "Contactar Consultor",
    variant: "corporate",
  },
];

function formatCop(amount: number): string {
  return amount.toLocaleString("es-CO", { maximumFractionDigits: 0 });
}

function planPriceCop(plan: Plan, billing: BillingPeriod): number {
  if (billing === "monthly") return plan.monthlyCop;
  return Math.round(plan.monthlyCop * (1 - ANNUAL_DISCOUNT));
}

export function PricingPage() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

  const periodLabel = useMemo(
    () => (billing === "monthly" ? "por mes" : "por mes (anual)"),
    [billing],
  );

  return (
    <div className="pb-20">
      <section className="mx-auto max-w-5xl px-4 pt-12 pb-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-3xl sm:text-4xl md:text-[42px] text-gray-900 leading-tight mb-4"
          style={{ fontWeight: 700 }}
        >
          Inversión en crecimiento,{" "}
          <span className="text-blue-600">no un gasto fijo</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="mx-auto max-w-2xl text-[14px] sm:text-[15px] text-gray-500 leading-relaxed"
        >
          Nos convertimos en tus socios. Cubre únicamente el costo técnico operativo, y nuestras
          ganancias dependerán directamente del éxito y escalabilidad de tu negocio.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <div className="relative inline-flex items-center rounded-full border border-gray-200 bg-[#FCFAF5] p-1 shadow-sm">
            {billing === "annual" && (
              <span
                className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] text-white sm:left-[calc(50%+3.5rem)] sm:translate-x-0"
                style={{ fontWeight: 600 }}
              >
                Ahorra 15%
              </span>
            )}
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-5 py-2 text-[13px] transition-colors cursor-pointer ${
                billing === "monthly"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={{ fontWeight: billing === "monthly" ? 600 : 500 }}
            >
              Pago Mensual
            </button>
            <button
              type="button"
              onClick={() => setBilling("annual")}
              className={`rounded-full px-5 py-2 text-[13px] transition-colors cursor-pointer ${
                billing === "annual"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={{ fontWeight: billing === "annual" ? 600 : 500 }}
            >
              Plan Anual
            </button>
          </div>

          <p className="text-[12px] text-gray-400">Haz clic en cualquier plan para obtener más información</p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
          {PLANS.map((plan, i) => {
            const price = planPriceCop(plan, billing);
            const isFeatured = plan.variant === "featured";
            const checkColor = isFeatured ? "text-emerald-500" : "text-blue-600";

            return (
              <motion.article
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className={`relative flex flex-col rounded-2xl bg-[#FCFAF5] p-6 sm:p-7 ${
                  isFeatured
                    ? "border-2 border-emerald-500 shadow-md md:-mt-1 md:mb-1"
                    : "border border-gray-200 shadow-sm"
                }`}
              >
                {isFeatured && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-emerald-500 px-3 py-1 text-[10px] tracking-wide text-white uppercase"
                    style={{ fontWeight: 700 }}
                  >
                    Socio estratégico (recomendado)
                  </div>
                )}

                <div className={isFeatured ? "pt-2" : undefined}>
                  <h2 className="text-xl text-gray-900" style={{ fontWeight: 700 }}>
                    {plan.name}
                  </h2>
                  <p className="mt-0.5 text-[13px] text-gray-500">{plan.subtitle}</p>

                  <div className="mt-5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
                    <span className="text-3xl sm:text-[34px] text-gray-900 tabular-nums" style={{ fontWeight: 700 }}>
                      $ {formatCop(price)}
                    </span>
                    <span className="text-[15px] text-gray-500" style={{ fontWeight: 500 }}>
                      COP
                    </span>
                  </div>
                  <p
                    className={`mt-1 text-[13px] ${billing === "annual" ? "text-emerald-600" : "text-gray-500"}`}
                    style={{ fontWeight: billing === "annual" ? 600 : 500 }}
                  >
                    {periodLabel}
                  </p>

                  {plan.revenueShare && (
                    <p
                      className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-center text-[12px] text-emerald-700"
                      style={{ fontWeight: 600 }}
                    >
                      {plan.revenueShare}
                    </p>
                  )}
                </div>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${checkColor}`} strokeWidth={2.5} />
                      <span className="text-[13px] text-gray-600 leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/contacto?plan=${encodeURIComponent(plan.id)}&billing=${billing}`}
                  className={`mt-8 flex w-full items-center justify-center gap-1.5 rounded-lg py-3 text-[14px] transition-colors ${
                    plan.variant === "featured"
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : plan.variant === "corporate"
                        ? "bg-[#1e293b] text-white hover:bg-[#0f172a]"
                        : "border-2 border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {plan.cta}
                  {plan.variant === "featured" && <Sparkles className="h-4 w-4 opacity-90" aria-hidden />}
                </Link>
              </motion.article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
