import { count, desc } from 'drizzle-orm';

import { db } from '../db/client.js';
import { links, type Link } from '../db/schema.js';
import type { ListLinksQuery } from '../schemas/link.js';

export interface ListLinksResult {
  links: Link[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Lista paginada de links (BE-06/BE-11), ordenada por created_at desc (D9).
 * Retorna também o total de registros para a paginação no front.
 */
export async function listLinks({ page, pageSize }: ListLinksQuery): Promise<ListLinksResult> {
  const offset = (page - 1) * pageSize;

  const [rows, totals] = await Promise.all([
    db.select().from(links).orderBy(desc(links.createdAt)).limit(pageSize).offset(offset),
    db.select({ total: count() }).from(links),
  ]);

  return { links: rows, total: totals[0]!.total, page, pageSize };
}
