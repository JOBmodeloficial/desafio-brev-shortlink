import cors from '@fastify/cors';
import Fastify, { type FastifyInstance } from 'fastify';

import { mapErrorToHttp } from './http/errors/index.js';
import { registerRoutes } from './http/routes/index.js';

/**
 * Constrói a instância Fastify (sem escutar em porta).
 * Exposto separadamente do `listen` para permitir testes via `app.inject`.
 */
export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: { level: process.env.NODE_ENV === 'test' ? 'silent' : 'info' } });

  await app.register(cors, { origin: true });

  // Error handler global: mapeia erros de negócio/Zod para status semânticos (D11).
  app.setErrorHandler((error, request, reply) => {
    const { statusCode, body } = mapErrorToHttp(error);
    if (statusCode >= 500) request.log.error(error);
    return reply.status(statusCode).send(body);
  });

  app.get('/health', async () => {
    return { status: 'ok' };
  });

  await registerRoutes(app);

  return app;
}

async function start(): Promise<void> {
  // Import dinâmico: a validação fail-fast de env só roda ao subir o servidor de fato.
  const { env } = await import('./env.js');
  const app = await buildApp();

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// Só inicia o listen fora do ambiente de teste (o smoke test importa `buildApp`).
if (process.env.NODE_ENV !== 'test') {
  void start();
}
