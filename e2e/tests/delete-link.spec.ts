import { HomePage } from '../pages/home.page';
import { expect, test } from './fixtures';

test.describe('Jornada 5 — Deletar link', () => {
  test('deleta um link e ele some da lista', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.createLink('https://exemplo.com', 'todelete');
    await expect(home.shortLink('todelete')).toBeVisible();

    await home.deleteButtons().first().click();

    // FE-04: o link deletado some da lista (asserção independente de estado global).
    await expect(home.shortLink('todelete')).toHaveCount(0);
  });
});
