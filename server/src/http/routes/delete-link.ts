import type { FastifyInstance } from 'fastify';

import { idParamSchema } from '../../schemas/link.js';
import { deleteLink } from '../../use-cases/delete-link.js';

export async function deleteLinkRoute(app: FastifyInstance): Promise<void> {
  app.delete('/links/:id', async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);
    await deleteLink(id);
    return reply.status(204).send();
  });
}
