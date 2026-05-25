import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { trackPageView } from "@/app/lib/googleAnalytics";

/**
 * Envía page_view en cada cambio de ruta del SPA.
 * La primera carga ya la registra el snippet en index.html.
 */
export function GoogleAnalyticsPageView() {
  const location = useLocation();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const pagePath = `${location.pathname}${location.search}${location.hash}`;

    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    trackPageView(pagePath, document.title);
  }, [location.pathname, location.search, location.hash]);

  return null;
}
