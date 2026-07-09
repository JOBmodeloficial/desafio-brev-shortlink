import { describe, expect, it } from 'vitest';

import { createLinkSchema, listLinksQuerySchema, toLinkDTO } from './link.js';
import type { Link } from '../db/schema.js';

describe('createLinkSchema', () => {
  it('aceita URL https e slug válido', () => {
    const result = createLinkSchema.parse({
      originalUrl: 'https://exemplo.com/pagina',
      shortUrl: 'meu-link',
    });
    expect(result.originalUrl).toBe('https://exemplo.com/pagina');
    expect(result.shortUrl).toBe('meu-link');
  });

  it('aceita URL http', () => {
    expect(() => createLinkSchema.parse({ originalUrl: 'http://exemplo.com' })).not.toThrow();
  });

  it('rejeita URL sem ser http/https (D13)', () => {
    const result = createLinkSchema.safeParse({ originalUrl: 'ftp://exemplo.com/arquivo' });
    expect(result.success).toBe(false);
  });

  it('rejeita string que não é URL', () => {
    const result = createLinkSchema.safeParse({ originalUrl: 'não-é-url' });
    expect(result.success).toBe(false);
  });

  it('trata shortUrl vazio como ausente (D8)', () => {
    const result = createLinkSchema.parse({ originalUrl: 'https://x.com', shortUrl: '' });
    expect(result.shortUrl).toBeUndefined();
  });

  it('aceita shortUrl ausente', () => {
    const result = createLinkSchema.parse({ originalUrl: 'https://x.com' });
    expect(result.shortUrl).toBeUndefined();
  });

  it.each(['Maiuscula', 'com espaco', 'under_score', 'acento-á', 'símbolo!'])(
    'rejeita slug inválido: %s',
    (slug) => {
      const result = createLinkSchema.safeParse({ originalUrl: 'https://x.com', shortUrl: slug });
      expect(result.success).toBe(false);
    },
  );
});

describe('listLinksQuerySchema', () => {
  it('aplica defaults page=1 pageSize=20', () => {
    expect(listLinksQuerySchema.parse({})).toEqual({ page: 1, pageSize: 20 });
  });

  it('coage strings de querystring para número', () => {
    expect(listLinksQuerySchema.parse({ page: '3', pageSize: '50' })).toEqual({
      page: 3,
      pageSize: 50,
    });
  });

  it('rejeita page < 1', () => {
    expect(listLinksQuerySchema.safeParse({ page: '0' }).success).toBe(false);
  });

  it('rejeita pageSize acima do máximo', () => {
    expect(listLinksQuerySchema.safeParse({ pageSize: '999' }).success).toBe(false);
  });
});

describe('toLinkDTO', () => {
  it('mapeia para camelCase com createdAt em ISO', () => {
    const createdAt = new Date('2026-07-08T12:00:00.000Z');
    const link: Link = {
      id: 'uuid-1',
      originalUrl: 'https://exemplo.com',
      shortUrl: 'abc',
      accessCount: 7,
      createdAt,
    };
    expect(toLinkDTO(link)).toEqual({
      id: 'uuid-1',
      originalUrl: 'https://exemplo.com',
      shortUrl: 'abc',
      accessCount: 7,
      createdAt: '2026-07-08T12:00:00.000Z',
    });
  });
});
