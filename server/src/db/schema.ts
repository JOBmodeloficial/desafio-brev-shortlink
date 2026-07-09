import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Tabela `links` (PRD §8.2, D1/D12).
 * - id: UUID (PK, gen_random_uuid — nativo do Postgres 13+).
 * - short_url: único (garante BE-03 e acelera o resolve BE-05/BE-11).
 * - access_count: contador de acessos (BE-07), default 0.
 * - created_at: única coluna de controle (D12).
 */
export const links = pgTable('links', {
  id: uuid('id').primaryKey().defaultRandom(),
  originalUrl: text('original_url').notNull(),
  shortUrl: text('short_url').notNull().unique(),
  accessCount: integer('access_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
