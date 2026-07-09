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
      include: [
        'src/use-cases/**',
        'src/http/routes/**',
        'src/http/errors/**',
        'src/schemas/**',
        'src/lib/slug.ts',
      ],
    },
  },
});
