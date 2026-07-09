import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../test/render';
import { server } from '../../../test/msw/server';
import { downloadFromUrl } from '../../../lib/download';
import { LinkList } from './LinkList';

vi.mock('../../../lib/download', () => ({ downloadFromUrl: vi.fn() }));

const API = 'http://localhost:3333';

function makeLink(over: Partial<Record<string, unknown>> = {}) {
  return {
    id: '1',
    originalUrl: 'https://exemplo.com',
    shortUrl: 'x',
    accessCount: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...over,
  };
}

describe('LinkList', () => {
  it('renderiza links com contador de acessos (FE-06)', async () => {
    server.use(
      http.get(`${API}/links`, () =>
        HttpResponse.json({
          links: [
            makeLink({ originalUrl: 'https://p.com', shortUrl: 'portfolio', accessCount: 248 }),
          ],
          total: 1,
          page: 1,
          pageSize: 100,
        }),
      ),
    );
    renderWithProviders(<LinkList />);

    expect(await screen.findByText('248 acessos')).toBeInTheDocument();
    expect(screen.getByText('https://p.com')).toBeInTheDocument();
  });

  it('mostra empty state e desabilita Baixar CSV quando vazio (FE-06/UX)', async () => {
    server.use(
      http.get(`${API}/links`, () =>
        HttpResponse.json({ links: [], total: 0, page: 1, pageSize: 100 }),
      ),
    );
    renderWithProviders(<LinkList />);

    expect(await screen.findByText(/Ainda não existem links/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Baixar CSV/i })).toBeDisabled();
  });

  it('deleta um link e revalida a lista (FE-04)', async () => {
    let listCall = 0;
    server.use(
      http.get(`${API}/links`, () => {
        listCall += 1;
        const links = listCall === 1 ? [makeLink({ id: 'del-1', shortUrl: 'todelete' })] : [];
        return HttpResponse.json({ links, total: links.length, page: 1, pageSize: 100 });
      }),
      http.delete(`${API}/links/del-1`, () => new HttpResponse(null, { status: 204 })),
    );
    renderWithProviders(<LinkList />);

    await userEvent.click(await screen.findByRole('button', { name: 'Deletar link' }));

    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Deletar link' })).not.toBeInTheDocument(),
    );
  });

  it('Baixar CSV chama o export e baixa a URL retornada (FE-08)', async () => {
    server.use(
      http.get(`${API}/links`, () =>
        HttpResponse.json({ links: [makeLink()], total: 1, page: 1, pageSize: 100 }),
      ),
      http.post(`${API}/links/exports`, () =>
        HttpResponse.json({ url: 'https://cdn.test/links-x.csv' }),
      ),
    );
    renderWithProviders(<LinkList />);

    await userEvent.click(await screen.findByRole('button', { name: /Baixar CSV/i }));

    await waitFor(() =>
      expect(downloadFromUrl).toHaveBeenCalledWith('https://cdn.test/links-x.csv'),
    );
  });
});
