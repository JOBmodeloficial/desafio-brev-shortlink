import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/use-cases/**', 'src/http/routes/**', 'src/http/errors/**', 'src/schemas/**'],
    },
  },
});
