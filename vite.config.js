import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Published at https://humanmint.github.io/film-estimator/ — GH Pages serves
// the project from the /film-estimator/ subpath, so production assets need
// that prefix. Keep dev server rooted at '/' so `npm run dev` stays ergonomic.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/film-estimator/' : '/',
  server: {
    port: 5173,
  },
}))
