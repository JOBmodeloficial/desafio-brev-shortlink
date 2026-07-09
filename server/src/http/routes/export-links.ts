import type { FastifyInstance } from 'fastify';

import { exportLinks } from '../../use-cases/export-links.js';

export async function exportLinksRoute(app: FastifyInstance): Promise<void> {
  app.post('/links/exports', async () => {
    return exportLinks();
  });
}
