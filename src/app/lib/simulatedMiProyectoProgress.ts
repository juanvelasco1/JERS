export type SimulatedPhase = {
  id: string;
  title: string;
  subtitle: string;
  /** 0–100 */
  percent: number;
  status: "completado" | "en curso" | "pendiente";
};

/** Genera fases estables por `seed` (p. ej. id de submission) para la vista previa ilustrativa. */
export function getSimulatedPhases(seed: string): SimulatedPhase[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  const u = Math.abs(h) % 19;
  const propuestaPct = Math.min(58, 24 + u);

  return [
    {
      id: "diag",
      title: "Diagnóstico digital",
      subtitle: "Cuestionario y lectura de contexto",
      percent: 100,
      status: "completado",
    },
    {
      id: "prop",
      title: "Propuesta y alcance",
      subtitle: "Prioridades acordadas con JERS (ilustrativo)",
      percent: propuestaPct,
      status: "en curso",
    },
    {
      id: "ux",
      title: "Diseño UI/UX",
      subtitle: "Wireframes y experiencia (ilustrativo)",
      percent: 0,
      status: "pendiente",
    },
    {
      id: "dev",
      title: "Desarrollo",
      subtitle: "Implementación por entregas (ilustrativo)",
      percent: 0,
      status: "pendiente",
    },
    {
      id: "go",
      title: "Lanzamiento",
      subtitle: "Go-live y seguimiento (ilustrativo)",
      percent: 0,
      status: "pendiente",
    },
  ];
}
