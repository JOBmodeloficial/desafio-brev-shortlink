import { HomePage } from '../pages/home.page';
import { expect, test } from './fixtures';

test.describe('Jornada 3 — Redirecionar + incremento', () => {
  test('acessar o link curto redireciona e incrementa o contador', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // A URL original aponta para a própria home (destino estável e local).
    await home.createLink('http://localhost:5173/', 'go');
    await expect(home.shortLink('go')).toBeVisible();

    await page.goto('/go');
    await page.waitForURL('http://localhost:5173/');

    await expect(page.getByText('1 acessos')).toBeVisible();
  });
});
