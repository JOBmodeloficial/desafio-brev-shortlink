import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError, http } from './http';

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status < 400,
    status,
    statusText: 'Status',
    text: async () => (body === undefined ? '' : JSON.stringify(body)),
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('http', () => {
  it('GET retorna o JSON parseado', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { hello: 'world' }));
    await expect(http.get('/x')).resolves.toEqual({ hello: 'world' });
  });

  it('DELETE 204 sem corpo resolve undefined', async () => {
    vi.stubGlobal('fetch', mockFetch(204, undefined));
    await expect(http.delete('/x/1')).resolves.toBeUndefined();
  });

  it('resposta de erro lança ApiError preservando o status (D11)', async () => {
    vi.stubGlobal('fetch', mockFetch(409, { message: 'já existe' }));
    const error = await http.post('/links', { a: 1 }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 409, message: 'já existe' });
  });

  it('erro com corpo não-JSON usa o statusText como mensagem', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'texto puro',
      }),
    );
    const error = await http.get('/x').catch((e: unknown) => e);
    expect(error).toMatchObject({ status: 500, message: 'Internal Server Error' });
  });
});
