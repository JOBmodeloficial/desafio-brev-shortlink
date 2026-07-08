import cors from '@fastify/cors';
import Fastify, { type FastifyInstance } from 'fastify';

/**
 * Constrói a instância Fastify (sem escutar em porta).
 * Exposto separadamente do `listen` para permitir testes via `app.inject`.
 * Não importa `env` no topo para manter o smoke test determinístico e livre de banco.
 */
export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });

  app.get('/health', async () => {
    return { status: 'ok' };
  });

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
