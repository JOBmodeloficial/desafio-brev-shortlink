import type { Readable } from 'node:stream';

import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { customAlphabet } from 'nanoid';

import { env } from '../env.js';

/** Nome de arquivo aleatório e único para o CSV (BE-10): links-<id>.csv. */
const randomId = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16);

export function buildCsvKey(): string {
  return `links-${randomId()}.csv`;
}

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
}

/** Lê a configuração do R2 do env, falhando com mensagem clara se algo estiver ausente. */
function getR2Config(): R2Config {
  const {
    CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_ACCESS_KEY_ID,
    CLOUDFLARE_SECRET_ACCESS_KEY,
    CLOUDFLARE_BUCKET,
    CLOUDFLARE_PUBLIC_URL,
  } = env;

  if (
    !CLOUDFLARE_ACCOUNT_ID ||
    !CLOUDFLARE_ACCESS_KEY_ID ||
    !CLOUDFLARE_SECRET_ACCESS_KEY ||
    !CLOUDFLARE_BUCKET ||
    !CLOUDFLARE_PUBLIC_URL
  ) {
    throw new Error('Cloudflare R2 não configurado: defina as variáveis CLOUDFLARE_*.');
  }

  return {
    accountId: CLOUDFLARE_ACCOUNT_ID,
    accessKeyId: CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY,
    bucket: CLOUDFLARE_BUCKET,
    publicUrl: CLOUDFLARE_PUBLIC_URL,
  };
}

let s3Client: S3Client | undefined;

function getClient(config: R2Config): S3Client {
  s3Client ??= new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
  return s3Client;
}

/**
 * Envia o CSV (stream ou buffer) ao R2 com nome único e retorna a URL pública da CDN.
 * Usa multipart (lib-storage) para suportar streams de tamanho desconhecido (D6).
 */
export async function uploadCsv(body: Readable | Buffer): Promise<string> {
  const config = getR2Config();
  const key = buildCsvKey();

  const upload = new Upload({
    client: getClient(config),
    params: {
      Bucket: config.bucket,
      Key: key,
      Body: body,
      ContentType: 'text/csv',
    },
  });

  await upload.done();

  return `${config.publicUrl.replace(/\/+$/, '')}/${key}`;
}
