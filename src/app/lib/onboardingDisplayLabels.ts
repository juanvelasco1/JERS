export function getInvestmentLabel(val: string) {
  if (val === "inicial") return "Menos de $5,000";
  if (val === "profesional") return "$5,000 — $20,000";
  if (val === "avanzado") return "Más de $20,000";
  return "Por definir";
}

export function getIndustriaLabel(val: string) {
  const map: Record<string, string> = {
    comercio: "Comercio",
    servicios: "Servicios",
    salud: "Salud",
    educacion: "Educación",
    otro: "Otro",
  };
  return map[val] || val;
}

export function getTamanoLabel(val: string) {
  const map: Record<string, string> = {
    solo: "Solo yo",
    pequeño: "2 — 10 personas",
    mediano: "11 — 50 personas",
  };
  return map[val] || val || "—";
}
