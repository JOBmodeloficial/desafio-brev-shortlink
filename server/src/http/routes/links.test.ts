import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { connection, db } from '../../db/client.js';
import { links } from '../../db/schema.js';
import { buildApp } from '../../server.js';
import { resetDb } from '../../test/helpers/reset-db.js';

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
  await connection.end();
});

beforeEach(async () => {
  await resetDb();
});

describe('POST /links', () => {
  it('cria link com URL e slug válidos (201) — BE-01', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/links',
      payload: { originalUrl: 'https://exemplo.com/pagina', shortUrl: 'meu-link' },
    });
    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body).toMatchObject({
      originalUrl: 'https://exemplo.com/pagina',
      shortUrl: 'meu-link',
      accessCount: 0,
    });
    expect(body.id).toEqual(expect.any(String));
    expect(body.createdAt).toEqual(expect.any(String));
  });

  it('gera slug aleatório quando shortUrl ausente (D8)', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/links',
      payload: { originalUrl: 'https://exemplo.com' },
    });
    expect(res.statusCode).toBe(201);
    expect(res.json().shortUrl).toMatch(/^[a-z0-9]+$/);
  });

  it('rejeita URL mal formatada (400) — BE-02', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/links',
      payload: { originalUrl: 'não-é-url', shortUrl: 'x' },
    });
    expect(res.statusCode).toBe(400);
  });

  it('rejeita slug mal formatado (400) — BE-02', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/links',
      payload: { originalUrl: 'https://exemplo.com', shortUrl: 'Slug Inválido!' },
    });
    expect(res.statusCode).toBe(400);
  });

  it('rejeita slug duplicado (409) — BE-03', async () => {
    const payload = { originalUrl: 'https://exemplo.com', shortUrl: 'dup' };
    await app.inject({ method: 'POST', url: '/links', payload });
    const res = await app.inject({ method: 'POST', url: '/links', payload });
    expect(res.statusCode).toBe(409);
  });
});

describe('GET /links', () => {
  it('lista paginada, ordenada por created_at desc, com total — BE-06/BE-11', async () => {
    await db.insert(links).values([
      { originalUrl: 'https://a.com', shortUrl: 'a', createdAt: new Date('2026-01-01T00:00:00Z') },
      { originalUrl: 'https://b.com', shortUrl: 'b', createdAt: new Date('2026-01-02T00:00:00Z') },
      { originalUrl: 'https://c.com', shortUrl: 'c', createdAt: new Date('2026-01-03T00:00:00Z') },
    ]);

    const res = await app.inject({ method: 'GET', url: '/links?page=1&pageSize=2' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.total).toBe(3);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(2);
    expect(body.links.map((l: { shortUrl: string }) => l.shortUrl)).toEqual(['c', 'b']);
  });

  it('retorna lista vazia e total 0 quando não há links', async () => {
    const res = await app.inject({ method: 'GET', url: '/links' });
    expect(res.json()).toMatchObject({ links: [], total: 0 });
  });
});

describe('GET /links/:shortUrl', () => {
  it('resolve e incrementa o acesso a cada chamada — BE-05/BE-07/D7', async () => {
    await app.inject({
      method: 'POST',
      url: '/links',
      payload: { originalUrl: 'https://destino.com', shortUrl: 'go' },
    });

    const first = await app.inject({ method: 'GET', url: '/links/go' });
    expect(first.statusCode).toBe(200);
    expect(first.json()).toMatchObject({ originalUrl: 'https://destino.com', accessCount: 1 });

    const second = await app.inject({ method: 'GET', url: '/links/go' });
    expect(second.json().accessCount).toBe(2);
  });

  it('slug inexistente retorna 404 — BE-05', async () => {
    const res = await app.inject({ method: 'GET', url: '/links/nao-existe' });
    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /links/:id', () => {
  it('deleta por id e retorna 204 — BE-04', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/links',
      payload: { originalUrl: 'https://exemplo.com', shortUrl: 'del' },
    });
    const { id } = created.json();

    const res = await app.inject({ method: 'DELETE', url: `/links/${id}` });
    expect(res.statusCode).toBe(204);
    expect(res.body).toBe('');

    const list = await app.inject({ method: 'GET', url: '/links' });
    expect(list.json().total).toBe(0);
  });

  it('id inexistente (UUID válido) retorna 404 — BE-04', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: '/links/00000000-0000-0000-0000-000000000000',
    });
    expect(res.statusCode).toBe(404);
  });

  it('id que não é UUID retorna 400 — D1', async () => {
    const res = await app.inject({ method: 'DELETE', url: '/links/not-a-uuid' });
    expect(res.statusCode).toBe(400);
  });
});
