import { afterEach, describe, expect, it, vi } from 'vitest';

import { downloadFromUrl } from './download';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('downloadFromUrl', () => {
  it('cria um anchor com a URL e dispara o clique', () => {
    const anchor = document.createElement('a');
    const click = vi.fn();
    anchor.click = click;
    vi.spyOn(document, 'createElement').mockReturnValue(anchor);

    downloadFromUrl('https://cdn.test/links-x.csv');

    expect(anchor.href).toContain('https://cdn.test/links-x.csv');
    expect(click).toHaveBeenCalledOnce();
  });
});
