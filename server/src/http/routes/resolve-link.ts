import type { FastifyInstance } from 'fastify';

import { shortUrlParamSchema, toLinkDTO } from '../../schemas/link.js';
import { resolveLink } from '../../use-cases/resolve-link.js';

export async function resolveLinkRoute(app: FastifyInstance): Promise<void> {
  app.get('/links/:shortUrl', async (request) => {
    const { shortUrl } = shortUrlParamSchema.parse(request.params);
    const link = await resolveLink(shortUrl);
    return toLinkDTO(link);
  });
}
