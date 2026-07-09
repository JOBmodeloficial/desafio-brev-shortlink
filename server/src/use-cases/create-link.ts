import { db } from '../db/client.js';
import { links, type Link } from '../db/schema.js';
import { ShortUrlAlreadyExistsError } from '../http/errors/index.js';
import { generateSlug } from '../lib/slug.js';
import type { CreateLinkInput } from '../schemas/link.js';

const MAX_SLUG_ATTEMPTS = 5;

/** Violação de unique constraint do Postgres (short_url duplicado). */
function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === '23505'
  );
}

/**
 * Cria um link (BE-01). Se `shortUrl` não foi informado, gera um slug aleatório (D8).
 * Slug informado e duplicado -> 409 (BE-03). Slug gerado que colide -> nova tentativa.
 */
export async function createLink(input: CreateLinkInput): Promise<Link> {
  const providedSlug = input.shortUrl;
  let attempts = 0;

  for (;;) {
    const shortUrl = providedSlug ?? generateSlug();

    try {
      const inserted = await db
        .insert(links)
        .values({ originalUrl: input.originalUrl, shortUrl })
        .returning();
      return inserted[0]!;
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;

      // Slug informado pelo usuário: conflito legítimo.
      if (providedSlug) throw new ShortUrlAlreadyExistsError();

      // Slug gerado: colisão rara — tenta novamente algumas vezes.
      attempts += 1;
      if (attempts >= MAX_SLUG_ATTEMPTS) {
        throw new ShortUrlAlreadyExistsError('Não foi possível gerar uma URL encurtada única.');
      }
    }
  }
}
