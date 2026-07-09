import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    // Testes de integração compartilham o mesmo Postgres — roda em série p/ evitar corrida.
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      // Gate da constitution (Art.4): use-cases e rotas com linhas>=85 / branches>=80.
      thresholds: { statements: 85, branches: 80, functions: 85, lines: 85 },
      include: [
        'src/use-cases/**',
        'src/http/routes/**',
        'src/http/errors/**',
        'src/schemas/**',
        'src/lib/slug.ts',
        'src/lib/csv.ts',
        'src/lib/storage.ts',
      ],
    },
  },
});
