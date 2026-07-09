import { afterEach, describe, expect, it, vi } from 'vitest';

import { copyToClipboard } from './clipboard';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('copyToClipboard', () => {
  it('retorna true ao copiar com sucesso', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    await expect(copyToClipboard('texto')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('texto');
  });

  it('retorna false quando a API falha', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('sem permissão')) },
    });
    await expect(copyToClipboard('texto')).resolves.toBe(false);
  });
});
