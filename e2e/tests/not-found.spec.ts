import { expect, test } from './fixtures';

test.describe('Jornada 4 — Não encontrado', () => {
  test('slug inexistente cai na página 404', async ({ page }) => {
    await page.goto('/inexistente-xyz');
    await expect(page.getByText('Link não encontrado')).toBeVisible();
  });

  test('rota inválida cai na página 404', async ({ page }) => {
    await page.goto('/algo/muito/invalido');
    await expect(page.getByText('Link não encontrado')).toBeVisible();
  });
});
