import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  clearScreen: false,
  /**
   * - host 0.0.0.0: localhost y también la IP de la máquina en la red.
   * - strictPort en false: si 5173 está ocupado, Vite usa el siguiente puerto (mira la terminal).
   * - watch: ignorar .env reduce reinicios en bucle.
   */
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    watch: {
      ignored: ['**/.env', '**/.env.*', '**/.git/**'],
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  /** Acelera el primer arranque de `vite` al pre-empaquetar dependencias pesadas. */
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router',
      'motion/react',
      'lucide-react',
    ],
  },
  plugins: [
    {
      name: 'jers-print-url',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          const a = server.httpServer?.address()
          if (a && typeof a === 'object') {
            const p = a.port
            const base = `http://localhost:${p}/`
            console.log(`\n  \x1b[36m\x1b[1mAbre en el navegador:\x1b[0m ${base}`)
            console.log(`  (Usa exactamente el puerto que indica Vite en “Local:” arriba.)\n`)
          }
        })
      },
    },
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],
})
