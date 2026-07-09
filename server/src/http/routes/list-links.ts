import type { FastifyInstance } from 'fastify';

import { listLinksQuerySchema, toLinkDTO } from '../../schemas/link.js';
import { listLinks } from '../../use-cases/list-links.js';

export async function listLinksRoute(app: FastifyInstance): Promise<void> {
  app.get('/links', async (request) => {
    const query = listLinksQuerySchema.parse(request.query);
    const result = await listLinks(query);
    return {
      links: result.links.map(toLinkDTO),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  });
}
