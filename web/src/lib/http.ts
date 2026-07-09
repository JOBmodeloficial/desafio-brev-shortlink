/**
 * Cliente HTTP do frontend. Centraliza toda a I/O de rede (constitution Art.1 R2),
 * derivando a baseURL de VITE_BACKEND_URL e preservando o status HTTP nos erros (D11)
 * para o front distinguir 400 (mal formatada) / 409 (duplicado) / 404 (não encontrado).
 */
const baseUrl = (import.meta.env.VITE_BACKEND_URL ?? '').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(method: string, path: string, payload?: unknown): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: payload !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: payload !== undefined ? JSON.stringify(payload) : undefined,
  });

  const text = await response.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data
        ? String((data as { message: unknown }).message)
        : response.statusText;
    throw new ApiError(response.status, message, data);
  }

  return data as T;
}

export const http = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, payload?: unknown) => request<T>('POST', path, payload),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
