import { screen } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test/render';
import { server } from '../../test/msw/server';
import { HomePage } from './index';

describe('HomePage', () => {
  it('renderiza o formulário de criação e a listagem', async () => {
    server.use(
      http.get('http://localhost:3333/links', () =>
        HttpResponse.json({ links: [], total: 0, page: 1, pageSize: 100 }),
      ),
    );

    renderWithProviders(<HomePage />);

    expect(screen.getByRole('heading', { name: 'Novo link' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Meus links' })).toBeInTheDocument();
    expect(await screen.findByText(/Ainda não existem links/i)).toBeInTheDocument();
  });
});
