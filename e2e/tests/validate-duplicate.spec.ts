import { HomePage } from '../pages/home.page';
import { expect, test } from './fixtures';

test.describe('Jornada 2 — Validação e duplicado', () => {
  test('bloqueia URL mal formatada com mensagem de validação', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.originalInput().fill('nao-eh-url');

    // Validação onChange: o erro aparece ao digitar e o submit fica desabilitado.
    await expect(page.getByText(/URL válida/i)).toBeVisible();
    await expect(home.saveButton()).toBeDisabled();
  });

  test('bloqueia slug duplicado (409)', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.createLink('https://exemplo.com', 'dup');
    await expect(home.shortLink('dup')).toBeVisible();

    await home.createLink('https://outro.com', 'dup');
    await expect(page.getByText('Essa URL encurtada já existe.')).toBeVisible();
  });
});
