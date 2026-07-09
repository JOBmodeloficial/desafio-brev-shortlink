import { ZodError } from 'zod';

/** Erro de negócio com status HTTP associado (D11). */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

/** URL/slug mal formatado (BE-02) -> 400. */
export class InvalidUrlError extends AppError {
  constructor(message = 'URL inválida.') {
    super(message, 400);
  }
}

/** Slug já existente (BE-03) -> 409. */
export class ShortUrlAlreadyExistsError extends AppError {
  constructor(message = 'Essa URL encurtada já existe.') {
    super(message, 409);
  }
}

/** Link inexistente (BE-04/BE-05) -> 404. */
export class LinkNotFoundError extends AppError {
  constructor(message = 'Link não encontrado.') {
    super(message, 404);
  }
}

export interface HttpErrorResponse {
  statusCode: number;
  body: {
    message: string;
    issues?: Record<string, string[] | undefined>;
  };
}

/**
 * Mapeia qualquer erro para uma resposta HTTP semântica (D11):
 * ZodError -> 400 (com issues), AppError -> seu statusCode, desconhecido -> 500 (sem vazar stack).
 */
export function mapErrorToHttp(error: unknown): HttpErrorResponse {
  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      body: { message: 'Dados inválidos.', issues: error.flatten().fieldErrors },
    };
  }

  if (error instanceof AppError) {
    return { statusCode: error.statusCode, body: { message: error.message } };
  }

  return { statusCode: 500, body: { message: 'Erro interno do servidor.' } };
}
