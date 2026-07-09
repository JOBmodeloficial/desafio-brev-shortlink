import { Readable } from 'node:stream';

import { describe, expect, it, vi } from 'vitest';

// Força o driver de storage para 'stub' (E2E) — sem tocar no R2.
vi.mock('../env.js', () => ({
  env: { STORAGE_DRIVER: 'stub', CLOUDFLARE_PUBLIC_URL: 'https://cdn.test' },
}));

const { uploadCsv } = await import('./storage.js');

describe('uploadCsv (stub)', () => {
  it('consome o stream e retorna uma URL fake sem subir ao R2', async () => {
    const url = await uploadCsv(Readable.from(['linha1\n', 'linha2\n']));
    expect(url).toMatch(/^https:\/\/cdn\.stub\.local\/links-[a-z0-9]{16}\.csv$/);
  });
});
