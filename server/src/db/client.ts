import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '../env.js';
import * as schema from './schema.js';

/**
 * Stub da Onda 0: cria a conexão Postgres e o cliente Drizzle.
 * As tabelas ainda não existem (schema é um stub vazio) — a fonte da verdade
 * do schema de negócio `links` é a Onda 1 (W1-T2/W1-T4).
 */
const queryClient = postgres(env.DATABASE_URL);

export const db = drizzle(queryClient, { schema });
