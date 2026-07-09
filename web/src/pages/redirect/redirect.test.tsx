import { screen, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test/render';
import { server } from '../../test/msw/server';
import { redirectTo } from '../../lib/redirect';
import { RedirectPage } from './index';

vi.mock('../../lib/redirect', () => ({ redirectTo: vi.fn() }));

const API = 'http://localhost:3333';
const routes = (
  <Routes>
    <Route path="/:shortUrl" element={<RedirectPage />} />
  </Routes>
);

describe('RedirectPage', () => {
  it('resolve o slug e redireciona para a URL original (FE-05/FE-07)', async () => {
    server.use(
      http.get(`${API}/links/go`, () =>
        HttpResponse.json({
          id: '1',
          originalUrl: 'https://destino.com',
          shortUrl: 'go',
          accessCount: 1,
          createdAt: '2026-01-01T00:00:00.000Z',
        }),
      ),
    );

    renderWithProviders(routes, { route: '/go' });

    await waitFor(() => expect(redirectTo).toHaveBeenCalledWith('https://destino.com'));
  });

  it('slug inexistente cai na página de não encontrado (FE-05)', async () => {
    server.use(
      http.get(`${API}/links/nope`, () => HttpResponse.json({ message: 'nf' }, { status: 404 })),
    );

    renderWithProviders(routes, { route: '/nope' });

    expect(await screen.findByText('Link não encontrado')).toBeInTheDocument();
  });
});
