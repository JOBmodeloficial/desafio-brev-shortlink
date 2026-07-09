import { customAlphabet } from 'nanoid';

/** Alfabeto restrito a [a-z0-9] — subconjunto do regex ^[a-z0-9-]+$ do slug (D8). */
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8);

/** Gera um slug aleatório e válido quando o usuário não informa um (D8). */
export function generateSlug(): string {
  return nanoid();
}
