import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        console.warn('⚠️ ROLLUP WARNING:', warning);
        warn(warning); // Keep default behavior
      }
    }
  }
})
