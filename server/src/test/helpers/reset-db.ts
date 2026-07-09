import { db } from '../../db/client.js';
import { links } from '../../db/schema.js';

/** Limpa a tabela links para isolar cada teste (sem depender de ordem). */
export async function resetDb(): Promise<void> {
  await db.delete(links);
}
