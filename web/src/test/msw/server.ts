import { setupServer } from 'msw/node';
import type { RequestHandler } from 'msw';

/**
 * MSW server compartilhado entre testes.
 *
 * Sem handlers de negócio nesta onda — W5-T10 preencherá o array com os endpoints
 * reais (`/links`, resolve, export). Mantido exportável para reuso.
 */
const handlers: RequestHandler[] = [];

export const server = setupServer(...handlers);
