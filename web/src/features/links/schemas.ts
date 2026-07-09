import { z } from 'zod';

/** URL de origem: URL válida e http/https (D13) — mesma regra do backend. */
export const originalUrlSchema = z
  .string()
  .trim()
  .url('Informe uma URL válida.')
  .refine((value) => /^https?:\/\//i.test(value), {
    message: 'A URL deve começar com http:// ou https://.',
  });

/** Slug: minúsculas, dígitos e hífens (D8). */
export const shortUrlSchema = z
  .string()
  .trim()
  .regex(/^[a-zA-Z0-9-]+$/, 'Use apenas letras, números e hífens.');

/** Form de criação: shortUrl opcional (vazio => undefined; gerado pelo backend — D8). */
export const createLinkSchema = z.object({
  originalUrl: originalUrlSchema,
  shortUrl: z.preprocess(
    (value) => (value === '' || value == null ? undefined : value),
    shortUrlSchema.optional(),
  ),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;

/**
 * Schema do formulário (RHF): valores sempre string. shortUrl aceita '' (vazio),
 * convertido para undefined no submit antes de chamar a API.
 */
export const linkFormSchema = z.object({
  originalUrl: originalUrlSchema,
  shortUrl: z.union([shortUrlSchema, z.literal('')]),
});

export type LinkFormValues = z.infer<typeof linkFormSchema>;

/** Item de link retornado pela API (PRD §8.1). */
export interface LinkItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: string;
}

/** Envelope da listagem paginada. */
export interface LinkListResponse {
  links: LinkItem[];
  total: number;
  page: number;
  pageSize: number;
}
