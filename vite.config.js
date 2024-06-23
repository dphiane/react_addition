import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'utils': '/src/utils',
      'api': '/src/api.ts',
      'types': '/src/types.ts',
      'components':'/src/components'
    }
  },
  build: {
    sourcemap: false,
  },
})
