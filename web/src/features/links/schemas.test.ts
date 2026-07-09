import { describe, expect, it } from 'vitest';

import { createLinkSchema } from './schemas';

describe('createLinkSchema', () => {
  it('aceita URL https e slug válido', () => {
    const result = createLinkSchema.parse({
      originalUrl: 'https://exemplo.com',
      shortUrl: 'meu-link',
    });
    expect(result).toEqual({ originalUrl: 'https://exemplo.com', shortUrl: 'meu-link' });
  });

  it('aceita URL http', () => {
    expect(createLinkSchema.safeParse({ originalUrl: 'http://exemplo.com' }).success).toBe(true);
  });

  it('rejeita esquema não http/https (D13)', () => {
    expect(createLinkSchema.safeParse({ originalUrl: 'ftp://x.com' }).success).toBe(false);
  });

  it('rejeita string que não é URL', () => {
    expect(createLinkSchema.safeParse({ originalUrl: 'nope' }).success).toBe(false);
  });

  it('trata shortUrl vazio como ausente (D8)', () => {
    expect(
      createLinkSchema.parse({ originalUrl: 'https://x.com', shortUrl: '' }).shortUrl,
    ).toBeUndefined();
  });

  it('aceita shortUrl ausente', () => {
    expect(createLinkSchema.parse({ originalUrl: 'https://x.com' }).shortUrl).toBeUndefined();
  });

  it.each(['Maiuscula', 'com espaco', 'under_score', 'acento-á'])(
    'rejeita slug inválido: %s',
    (slug) => {
      expect(
        createLinkSchema.safeParse({ originalUrl: 'https://x.com', shortUrl: slug }).success,
      ).toBe(false);
    },
  );
});
