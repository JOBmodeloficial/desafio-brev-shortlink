import type { Readable } from 'node:stream';

import type { FastifyInstance } from 'fastify';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { connection, db } from '../../db/client.js';
import { links } from '../../db/schema.js';
import { resetDb } from '../../test/helpers/reset-db.js';

const captured = vi.hoisted(() => ({ csv: '' }));

async function readStream(stream: Readable): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk as Buffer));
  }
  return Buffer.concat(chunks).toString('utf-8');
}

// Mocka o upload ao R2: captura o CSV gerado e devolve uma URL determinística.
vi.mock('../../lib/storage.js', () => ({
  buildCsvKey: () => 'links-mocked.csv',
  uploadCsv: async (body: Readable) => {
    captured.csv = await readStream(body);
    return 'https://cdn.test/links-mocked.csv';
  },
}));

const { buildApp } = await import('../../server.js');

let app: FastifyInstance;

beforeEach(async () => {
  await resetDb();
  captured.csv = '';
  app ??= await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
  await connection.end();
});

describe('POST /links/exports', () => {
  it('gera o CSV, envia ao R2 e retorna { url } (BE-08/BE-09/BE-10/D10)', async () => {
    await db.insert(links).values({
      originalUrl: 'https://exemplo.com',
      shortUrl: 'go',
      accessCount: 5,
      createdAt: new Date('2026-01-01T00:00:00Z'),
    });

    const res = await app.inject({ method: 'POST', url: '/links/exports' });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ url: 'https://cdn.test/links-mocked.csv' });

    const lines = captured.csv.trimEnd().split('\n');
    expect(lines[0]).toBe('original_url,short_url,access_count,created_at');
    expect(lines[1]).toBe('https://exemplo.com,go,5,2026-01-01T00:00:00.000Z');
  });
});
