import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
  AppError,
  InvalidUrlError,
  LinkNotFoundError,
  ShortUrlAlreadyExistsError,
  mapErrorToHttp,
} from './index.js';

describe('erros de negócio', () => {
  it('cada erro tem statusCode e name corretos', () => {
    expect(new InvalidUrlError()).toMatchObject({ statusCode: 400, name: 'InvalidUrlError' });
    expect(new ShortUrlAlreadyExistsError()).toMatchObject({
      statusCode: 409,
      name: 'ShortUrlAlreadyExistsError',
    });
    expect(new LinkNotFoundError()).toMatchObject({ statusCode: 404, name: 'LinkNotFoundError' });
    expect(new InvalidUrlError()).toBeInstanceOf(AppError);
    expect(new InvalidUrlError()).toBeInstanceOf(Error);
  });
});

describe('mapErrorToHttp', () => {
  it('ZodError -> 400 com issues', () => {
    const error = z.object({ a: z.string() }).safeParse({ a: 1 }).error!;
    const result = mapErrorToHttp(error);
    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe('Dados inválidos.');
    expect(result.body.issues).toBeDefined();
  });

  it('ShortUrlAlreadyExistsError -> 409', () => {
    expect(mapErrorToHttp(new ShortUrlAlreadyExistsError()).statusCode).toBe(409);
  });

  it('LinkNotFoundError -> 404', () => {
    expect(mapErrorToHttp(new LinkNotFoundError()).statusCode).toBe(404);
  });

  it('InvalidUrlError -> 400', () => {
    expect(mapErrorToHttp(new InvalidUrlError()).statusCode).toBe(400);
  });

  it('erro desconhecido -> 500 sem vazar detalhes', () => {
    const result = mapErrorToHttp(new Error('boom com stack secreto'));
    expect(result.statusCode).toBe(500);
    expect(result.body.message).toBe('Erro interno do servidor.');
    expect(result.body).not.toHaveProperty('issues');
  });
});
