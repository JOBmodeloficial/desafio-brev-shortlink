import { eq } from 'drizzle-orm';

import { db } from '../db/client.js';
import { links } from '../db/schema.js';
import { LinkNotFoundError } from '../http/errors/index.js';

/**
 * Deleta um link pelo id UUID (BE-04, D1). Id inexistente -> 404.
 */
export async function deleteLink(id: string): Promise<void> {
  const deleted = await db.delete(links).where(eq(links.id, id)).returning({ id: links.id });

  if (deleted.length === 0) throw new LinkNotFoundError();
}
