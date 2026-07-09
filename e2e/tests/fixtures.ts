import { test as base, expect } from '@playwright/test';
import postgres from 'postgres';

const DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgresql://brevly:brevly@localhost:5432/brevly';

/**
 * Auto-fixture que limpa a tabela links ANTES de cada teste (ambiente determinístico
 * — Art.5 R2). Usa `auto: true` para rodar em todos os specs: um `beforeEach` declarado
 * num módulo compartilhado não é aplicado por arquivo no Playwright.
 */
export const test = base.extend<{ cleanDb: void }>({
  cleanDb: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      const sql = postgres(DATABASE_URL, { max: 1 });
      try {
        await sql`DELETE FROM links`;
      } finally {
        await sql.end();
      }
      await use();
    },
    { auto: true },
  ],
});

export { expect };
