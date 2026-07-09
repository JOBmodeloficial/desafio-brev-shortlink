import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { connection } from '../db/client.js';
import { ShortUrlAlreadyExistsError } from '../http/errors/index.js';
import { resetDb } from '../test/helpers/reset-db.js';
import { createLink } from './create-link.js';

// Força todo slug gerado a colidir para exercitar a exaustão de retentativas.
vi.mock('../lib/slug.js', () => ({ generateSlug: () => 'colisao-fixa' }));

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await connection.end();
});

describe('createLink — geração de slug', () => {
  it('lança 409 após esgotar as retentativas de slug gerado', async () => {
    await createLink({ originalUrl: 'https://a.com' }); // ocupa 'colisao-fixa'
    await expect(createLink({ originalUrl: 'https://b.com' })).rejects.toBeInstanceOf(
      ShortUrlAlreadyExistsError,
    );
  });
});
