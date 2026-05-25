export const GA_MEASUREMENT_ID = "G-3Q84V9S8B9";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function isGoogleAnalyticsEnabled(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

/** Vista de página en navegación SPA (no usar en la carga inicial: ya la envía index.html). */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (!isGoogleAnalyticsEnabled()) return;
  window.gtag!("config", GA_MEASUREMENT_ID, {
    page_path: pagePath,
    ...(pageTitle ? { page_title: pageTitle } : {}),
  });
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (!isGoogleAnalyticsEnabled()) return;
  window.gtag!("event", eventName, params);
}

/** Informe de diagnóstico generado (Onboarding). Sin datos personales del formulario. */
export function trackDiagnosisReportGenerated(params: {
  source: string;
  usedFallback: boolean;
  hasContextFiles: boolean;
  promptCount: number;
}): void {
  trackEvent("generate_report", {
    event_category: "diagnosis",
    report_source: params.source,
    used_fallback: params.usedFallback,
    has_context_files: params.hasContextFiles,
    prompt_count: params.promptCount,
  });
}
