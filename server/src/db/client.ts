import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '../env.js';
import * as schema from './schema.js';

/**
 * Conexão Postgres (postgres-js) + cliente Drizzle vinculado ao schema.
 * `connection` é exportada para permitir fechamento gracioso em testes/streaming.
 */
export const connection = postgres(env.DATABASE_URL);

export const db = drizzle(connection, { schema });
