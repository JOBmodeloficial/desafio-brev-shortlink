import { defineConfig, devices } from '@playwright/test';

const BACKEND_URL = 'http://localhost:3333';
const FRONTEND_URL = 'http://localhost:5173';
const DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgresql://brevly:brevly@localhost:5432/brevly';

/**
 * E2E do Brev.ly — as 7 jornadas da constitution (Art.5) em desktop + mobile,
 * sobre um ambiente efêmero (Postgres via docker-compose + servers via webServer).
 * O storage roda em modo 'stub' (sem R2 real) na jornada de CSV.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: FRONTEND_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev',
      cwd: '../server',
      url: `${BACKEND_URL}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: {
        PORT: '3333',
        DATABASE_URL,
        STORAGE_DRIVER: 'stub',
      },
    },
    {
      command: 'npm run dev -- --port 5173 --strictPort',
      cwd: '../web',
      url: FRONTEND_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: {
        VITE_BACKEND_URL: BACKEND_URL,
        VITE_FRONTEND_URL: FRONTEND_URL,
      },
    },
  ],
});
