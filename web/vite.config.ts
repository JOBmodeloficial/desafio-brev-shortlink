import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    env: {
      VITE_BACKEND_URL: 'http://localhost:3333',
      VITE_FRONTEND_URL: 'http://localhost:5173',
    },
    coverage: {
      provider: 'v8',
      include: ['src/features/links/**', 'src/components/**', 'src/lib/**', 'src/pages/**'],
      // Gate da constitution (Art.3): features/links com linhas>=80 / branches>=75.
      thresholds: {
        'src/features/links/**': { statements: 80, branches: 75, functions: 80, lines: 80 },
      },
    },
  },
});
