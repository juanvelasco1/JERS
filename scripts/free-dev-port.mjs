#!/usr/bin/env node
/**
 * Libera el puerto de Vite (5173) si hay un proceso colgado.
 * Uso: node scripts/free-dev-port.mjs && npm run dev
 */
import { execSync } from "node:child_process";

const port = process.env.VITE_PORT || "5173";

try {
  execSync(`lsof -tiTCP:${port} -sTCP:LISTEN`, { stdio: "pipe" });
} catch {
  process.exit(0);
}

try {
  execSync(`lsof -tiTCP:${port} -sTCP:LISTEN | xargs kill -9`, { shell: true, stdio: "inherit" });
  console.info(`[free-dev-port] Liberado el puerto ${port}.`);
} catch {
  console.warn(`[free-dev-port] No se pudo liberar el puerto ${port}; prueba a cerrar otras instancias de Vite.`);
}
