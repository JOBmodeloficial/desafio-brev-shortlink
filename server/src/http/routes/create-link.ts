import type { FastifyInstance } from 'fastify';

import { createLinkSchema, toLinkDTO } from '../../schemas/link.js';
import { createLink } from '../../use-cases/create-link.js';

export async function createLinkRoute(app: FastifyInstance): Promise<void> {
  app.post('/links', async (request, reply) => {
    const input = createLinkSchema.parse(request.body);
    const link = await createLink(input);
    return reply.status(201).send(toLinkDTO(link));
  });
}
