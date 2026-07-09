import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../../test/render';
import { server } from '../../../test/msw/server';
import { LinkForm } from './LinkForm';

const API = 'http://localhost:3333';

const link = {
  id: '1',
  originalUrl: 'https://exemplo.com',
  shortUrl: 'meu-link',
  accessCount: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('LinkForm', () => {
  it('cria link com dados válidos e limpa o formulário (FE-01)', async () => {
    server.use(http.post(`${API}/links`, () => HttpResponse.json(link, { status: 201 })));
    renderWithProviders(<LinkForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Link original'), 'https://exemplo.com');
    await user.type(screen.getByLabelText('Link encurtado'), 'meu-link');
    await user.click(screen.getByRole('button', { name: 'Salvar link' }));

    await waitFor(() => expect(screen.getByLabelText('Link original')).toHaveValue(''));
  });

  it('bloqueia URL mal formatada sem chamar a API (FE-02)', async () => {
    renderWithProviders(<LinkForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Link original'), 'nao-eh-url');
    await user.click(screen.getByRole('button', { name: 'Salvar link' }));

    expect(await screen.findByText(/URL válida/i)).toBeInTheDocument();
  });

  it('exibe erro de conflito quando a API responde 409 (FE-03)', async () => {
    server.use(
      http.post(`${API}/links`, () => HttpResponse.json({ message: 'dup' }, { status: 409 })),
    );
    renderWithProviders(<LinkForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Link original'), 'https://exemplo.com');
    await user.type(screen.getByLabelText('Link encurtado'), 'existente');
    await user.click(screen.getByRole('button', { name: 'Salvar link' }));

    expect(await screen.findByText('Essa URL encurtada já existe.')).toBeInTheDocument();
  });
});
