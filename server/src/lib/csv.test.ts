import type { Readable } from 'node:stream';

import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import { connection, db } from '../db/client.js';
import { links } from '../db/schema.js';
import { resetDb } from '../test/helpers/reset-db.js';
import { CSV_HEADER, createLinksCsvStream, escapeCsvField } from './csv.js';

async function streamToString(stream: Readable): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk as Buffer));
  }
  return Buffer.concat(chunks).toString('utf-8');
}

describe('escapeCsvField', () => {
  it('mantém valor simples sem alteração', () => {
    expect(escapeCsvField('https://exemplo.com')).toBe('https://exemplo.com');
  });

  it('envolve em aspas quando há vírgula', () => {
    expect(escapeCsvField('a,b')).toBe('"a,b"');
  });

  it('duplica aspas internas e envolve', () => {
    expect(escapeCsvField('diz "oi"')).toBe('"diz ""oi"""');
  });

  it('envolve quando há quebra de linha', () => {
    expect(escapeCsvField('linha1\nlinha2')).toBe('"linha1\nlinha2"');
  });
});

describe('createLinksCsvStream', () => {
  beforeEach(async () => {
    await resetDb();
  });

  afterAll(async () => {
    await connection.end();
  });

  it('gera header + uma linha por link, ordenado desc, com escaping (BE-08/BE-12)', async () => {
    await db.insert(links).values([
      {
        originalUrl: 'https://antigo.com/a,b',
        shortUrl: 'antigo',
        accessCount: 3,
        createdAt: new Date('2026-01-01T00:00:00Z'),
      },
      {
        originalUrl: 'https://novo.com',
        shortUrl: 'novo',
        accessCount: 10,
        createdAt: new Date('2026-01-02T00:00:00Z'),
      },
    ]);

    const csv = await streamToString(createLinksCsvStream());
    const lines = csv.trimEnd().split('\n');

    expect(lines[0]).toBe(CSV_HEADER);
    // mais novo primeiro (created_at desc)
    expect(lines[1]).toBe('https://novo.com,novo,10,2026-01-02T00:00:00.000Z');
    // vírgula no campo -> escapado com aspas
    expect(lines[2]).toBe('"https://antigo.com/a,b",antigo,3,2026-01-01T00:00:00.000Z');
  });
});
