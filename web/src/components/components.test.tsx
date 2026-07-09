import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';
import { IconButton } from './IconButton';
import { Input } from './Input';
import { Logo } from './Logo';

describe('Button', () => {
  it('renderiza e dispara onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Salvar</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('loading desabilita o clique e mostra indicador', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Salvar
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renderiza a variante secondary', () => {
    render(<Button variant="secondary">Baixar CSV</Button>);
    expect(screen.getByRole('button', { name: 'Baixar CSV' })).toHaveClass('bg-surface-2');
  });
});

describe('Input', () => {
  it('associa label e exibe erro com aria-invalid', () => {
    render(<Input label="Link original" error="URL inválida" placeholder="www..." />);
    const input = screen.getByLabelText('Link original');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('URL inválida')).toBeInTheDocument();
  });

  it('renderiza o prefixo', () => {
    render(<Input label="Link encurtado" prefix="brev.ly/" />);
    expect(screen.getByText('brev.ly/')).toBeInTheDocument();
  });
});

describe('IconButton', () => {
  it('encontra o botão pelo aria-label', () => {
    render(<IconButton label="Copiar" />);
    expect(screen.getByRole('button', { name: 'Copiar' })).toBeInTheDocument();
  });
});

describe('Logo', () => {
  it('renderiza a imagem dentro de um link para /', () => {
    render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>,
    );
    expect(screen.getByRole('img', { name: 'brev.ly' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'brev.ly' })).toHaveAttribute('href', '/');
  });

  it('variante icon usa o asset do ícone isolado', () => {
    render(
      <MemoryRouter>
        <Logo variant="icon" />
      </MemoryRouter>,
    );
    expect(screen.getByRole('img', { name: 'brev.ly' })).toHaveAttribute(
      'src',
      '/brev.ly-logo-alone.png',
    );
  });
});
