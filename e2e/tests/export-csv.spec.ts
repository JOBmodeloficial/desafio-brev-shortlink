import { HomePage } from '../pages/home.page';
import { expect, test } from './fixtures';

test.describe('Jornada 6 — Baixar CSV', () => {
  test('Baixar CSV chama o export e retorna a URL do arquivo', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.createLink('https://exemplo.com', 'csv');
    await expect(home.shortLink('csv')).toBeVisible();

    const [response] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().endsWith('/links/exports') && r.request().method() === 'POST',
      ),
      home.downloadCsvButton().click(),
    ]);

    expect(response.status()).toBe(200);
    const body = (await response.json()) as { url: string };
    expect(body.url).toMatch(/\.csv$/);
  });
});
