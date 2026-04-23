import { createBrowserRouter, Outlet } from "react-router";
import { Layout } from "./components/Layout";

function RootOutlet() {
  return <Outlet />;
}

/** `conocenos` va fuera de `Layout` (pantalla completa con cabecera propia). El resto mantiene el layout del sitio. */
export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootOutlet />,
      children: [
        {
          path: "conocenos",
          lazy: async () => {
            const m = await import("./components/ConocenosPage");
            return { Component: m.ConocenosPage };
          },
        },
        {
          Component: Layout,
          children: [
            {
              index: true,
              lazy: async () => {
                const m = await import("./components/HomePage");
                return { Component: m.HomePage };
              },
            },
            {
              path: "diagnostico",
              lazy: async () => {
                const m = await import("./components/DiagnosticoPage");
                return { Component: m.DiagnosticoPage };
              },
            },
            {
              path: "pricing",
              lazy: async () => {
                const m = await import("./components/PricingPage");
                return { Component: m.PricingPage };
              },
            },
            {
              path: "portafolio",
              lazy: async () => {
                const m = await import("./components/PortfolioPage");
                return { Component: m.PortfolioPage };
              },
            },
            {
              path: "portafolio/chess-manager",
              lazy: async () => {
                const m = await import("./components/ProjectDetailPage");
                return { Component: m.ProjectDetailPage };
              },
            },
            {
              path: "terminos",
              lazy: async () => {
                const m = await import("./components/TerminosPage");
                return { Component: m.TerminosPage };
              },
            },
            {
              path: "contacto",
              lazy: async () => {
                const m = await import("./components/ContactPage");
                return { Component: m.ContactPage };
              },
            },
            {
              path: "*",
              lazy: async () => {
                const m = await import("./components/NotFound");
                return { Component: m.NotFound };
              },
            },
          ],
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
