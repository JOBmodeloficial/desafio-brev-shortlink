import { eq, sql } from 'drizzle-orm';

import { db } from '../db/client.js';
import { links, type Link } from '../db/schema.js';
import { LinkNotFoundError } from '../http/errors/index.js';

/**
 * Resolve a URL original pela URL encurtada e incrementa o acesso de forma
 * atômica no mesmo UPDATE (BE-05/BE-07, D7 — sem endpoint dedicado).
 * Slug inexistente -> 404.
 */
export async function resolveLink(shortUrl: string): Promise<Link> {
  const [link] = await db
    .update(links)
    .set({ accessCount: sql`${links.accessCount} + 1` })
    .where(eq(links.shortUrl, shortUrl))
    .returning();

  if (!link) throw new LinkNotFoundError();

  return link;
}
