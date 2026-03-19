import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { DiagnosticoPage } from "./components/DiagnosticoPage";
import { PricingPage } from "./components/PricingPage";
import { PortfolioPage } from "./components/PortfolioPage";
import { ProjectDetailPage } from "./components/ProjectDetailPage";
import { TerminosPage } from "./components/TerminosPage";
import { ContactPage } from "./components/ContactPage";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "diagnostico", Component: DiagnosticoPage },
      { path: "pricing", Component: PricingPage },
      { path: "portafolio", Component: PortfolioPage },
      { path: "portafolio/chess-manager", Component: ProjectDetailPage },
      { path: "terminos", Component: TerminosPage },
      { path: "contacto", Component: ContactPage },
      { path: "*", Component: NotFound },
    ],
  },
]);