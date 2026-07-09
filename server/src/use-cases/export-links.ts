import type { Readable } from 'node:stream';

import { createLinksCsvStream } from '../lib/csv.js';
import { uploadCsv } from '../lib/storage.js';

export interface ExportLinksDeps {
  createCsvStream?: () => Readable;
  upload?: (body: Readable) => Promise<string>;
}

/**
 * Exporta os links: gera o CSV por streaming e envia ao R2, retornando a URL da CDN
 * (BE-08/BE-09/BE-10, D6/D10). Dependências injetáveis para testes (R2 mockável).
 */
export async function exportLinks(deps: ExportLinksDeps = {}): Promise<{ url: string }> {
  const createCsvStream = deps.createCsvStream ?? createLinksCsvStream;
  const upload = deps.upload ?? uploadCsv;

  const url = await upload(createCsvStream());

  return { url };
}
