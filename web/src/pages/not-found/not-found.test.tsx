import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test/render';
import { NotFoundPage } from './index';

describe('NotFoundPage', () => {
  it('renderiza o título 404 e a mensagem', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByText('Link não encontrado')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
  });
});
