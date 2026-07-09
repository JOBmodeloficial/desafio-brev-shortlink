import { Readable } from 'node:stream';

import { connection } from '../db/client.js';

/** Cabeçalho do CSV com os 4 campos obrigatórios (BE-12). */
export const CSV_HEADER = 'original_url,short_url,access_count,created_at';

/** Escapa um campo CSV: envolve em aspas e duplica aspas internas quando há vírgula/aspas/quebra. */
export function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

interface LinkCsvRow {
  original_url: string;
  short_url: string;
  access_count: number;
  created_at: Date | string;
}

function toCsvLine(row: LinkCsvRow): string {
  return [
    escapeCsvField(row.original_url),
    escapeCsvField(row.short_url),
    String(row.access_count),
    new Date(row.created_at).toISOString(),
  ].join(',');
}

/** Gera as linhas do CSV percorrendo os links via cursor (sem carregar tudo em memória — D6). */
async function* generateCsvRows(): AsyncGenerator<string> {
  yield `${CSV_HEADER}\n`;

  const cursor = connection<LinkCsvRow[]>`
    SELECT original_url, short_url, access_count, created_at
    FROM links
    ORDER BY created_at DESC
  `.cursor(100);

  for await (const rows of cursor) {
    for (const row of rows) {
      yield `${toCsvLine(row)}\n`;
    }
  }
}

/** Readable com o CSV completo dos links (header + uma linha por link). */
export function createLinksCsvStream(): Readable {
  return Readable.from(generateCsvRows());
}
