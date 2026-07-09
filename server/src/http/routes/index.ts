import type { FastifyInstance } from 'fastify';

import { createLinkRoute } from './create-link.js';
import { deleteLinkRoute } from './delete-link.js';
import { listLinksRoute } from './list-links.js';
import { resolveLinkRoute } from './resolve-link.js';

/** Registra todas as rotas de links (create/list/resolve/delete). */
export async function registerRoutes(app: FastifyInstance): Promise<void> {
  await app.register(createLinkRoute);
  await app.register(listLinksRoute);
  await app.register(resolveLinkRoute);
  await app.register(deleteLinkRoute);
}
