import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Published at https://humanmint.github.io/bowens-film-estimator/ — GH Pages
// serves the project from that subpath, so production assets need the prefix.
// Keep dev server rooted at '/' so `npm run dev` stays ergonomic.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/bowens-film-estimator/' : '/',
  server: {
    port: 5173,
  },
}))
