import { describe, expect, it, vi } from 'vitest';

import { buildCsvKey, uploadCsv } from './storage.js';

// Captura os params do Upload e evita qualquer chamada de rede ao R2.
const state = vi.hoisted(() => ({ params: undefined as unknown }));

vi.mock('@aws-sdk/lib-storage', () => ({
  Upload: class {
    constructor(opts: { params: unknown }) {
      state.params = opts.params;
    }
    async done(): Promise<void> {}
  },
}));

describe('buildCsvKey', () => {
  it('gera nome no padrão links-<id>.csv (BE-10)', () => {
    expect(buildCsvKey()).toMatch(/^links-[a-z0-9]{16}\.csv$/);
  });

  it('gera nomes únicos', () => {
    expect(buildCsvKey()).not.toBe(buildCsvKey());
  });
});

describe('uploadCsv', () => {
  it('envia como text/csv e retorna a URL pública (BE-09)', async () => {
    const url = await uploadCsv(Buffer.from('original_url,short_url\n'));

    expect(url).toMatch(/^https:\/\/cdn\.test\/links-[a-z0-9]{16}\.csv$/);
    expect(state.params).toMatchObject({
      Bucket: 'test-bucket',
      ContentType: 'text/csv',
    });
  });
});
