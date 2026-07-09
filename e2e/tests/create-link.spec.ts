import { HomePage } from '../pages/home.page';
import { expect, test } from './fixtures';

test.describe('Jornada 1 — Criar link', () => {
  test('cria link com slug informado e ele aparece na listagem', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.createLink('https://www.rocketseat.com.br', 'rocketseat');

    await expect(home.shortLink('rocketseat')).toBeVisible();
    await expect(page.getByText('0 acessos')).toBeVisible();
  });

  test('cria link sem slug (gerado) e ele aparece na listagem', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.createLink('https://exemplo.com');

    await expect(page.getByText('0 acessos')).toBeVisible();
  });
});
