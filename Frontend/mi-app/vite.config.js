
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'


export default defineConfig(({ mode }) => {
  // Carga el archivo .env según el modo actual (desarrollo, producción, etc.)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          // Usa la variable de entorno. Si no existe, usa localhost:8080 por defecto
          target: env.VITE_BACKEND_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})