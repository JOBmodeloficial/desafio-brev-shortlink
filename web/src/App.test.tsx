import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { queryClient } from './lib/query-client';
import { HomePage } from './pages/home';

/**
 * Smoke test do scaffold: monta o router (rota `/`) dentro dos providers e afirma
 * que renderiza um heading identificável. Prova que jsdom + RTL + jest-dom + setup
 * estão operacionais. Sem asserções sobre UI final.
 */
describe('App scaffold', () => {
  it('renders the home route heading without throwing', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <HomePage />,
        },
      ],
      { initialEntries: ['/'] },
    );

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
  });
});
