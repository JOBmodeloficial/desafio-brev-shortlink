import { z } from 'zod';

import type { Link } from '../db/schema.js';

/** URL de origem: precisa ser uma URL válida e http/https (D13). */
export const originalUrlSchema = z
  .string()
  .trim()
  .url('Informe uma URL válida.')
  .refine((value) => /^https?:\/\//i.test(value), {
    message: 'A URL deve começar com http:// ou https://.',
  });

/** Slug da URL encurtada: minúsculas, dígitos e hífens (D8). Vazio/ausente => undefined. */
export const shortUrlSchema = z
  .string()
  .trim()
  .regex(
    /^[a-zA-Z0-9-]+$/,
    'Use apenas letras, números e hífens (sem espaços ou caracteres especiais).',
  );

/** Body de criação: originalUrl obrigatória; shortUrl opcional (gerada se ausente/vazia — D8). */
export const createLinkSchema = z.object({
  originalUrl: originalUrlSchema,
  shortUrl: z.preprocess(
    (value) => (value === '' || value == null ? undefined : value),
    shortUrlSchema.optional(),
  ),
});

/** Query de listagem paginada (D9): defaults page=1/pageSize=20. */
export const listLinksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type ListLinksQuery = z.infer<typeof listLinksQuerySchema>;

/** Param da rota de resolve: apenas não-vazio (slug inexistente -> 404, não 400). */
export const shortUrlParamSchema = z.object({
  shortUrl: z.string().min(1),
});

/** Param da rota de delete: precisa ser UUID (D1). id inválido -> 400. */
export const idParamSchema = z.object({
  id: z.string().uuid('Identificador inválido.'),
});

/** DTO de saída em camelCase (createdAt em ISO-8601). */
export interface LinkDTO {
  id: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: string;
}

export function toLinkDTO(link: Link): LinkDTO {
  return {
    id: link.id,
    originalUrl: link.originalUrl,
    shortUrl: link.shortUrl,
    accessCount: link.accessCount,
    createdAt: link.createdAt.toISOString(),
  };
}
