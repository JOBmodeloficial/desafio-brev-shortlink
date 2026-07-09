import { HomePage } from '../pages/home.page';
import { expect, test } from './fixtures';

test.describe('Jornada 7 — Empty state', () => {
  test('lista vazia mostra o empty state e desabilita Baixar CSV', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await expect(home.emptyState()).toBeVisible();
    await expect(home.downloadCsvButton()).toBeDisabled();
  });
});
