import type { Locator, Page } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  originalInput(): Locator {
    return this.page.getByLabel('Link original');
  }

  shortInput(): Locator {
    return this.page.getByLabel('Link encurtado');
  }

  saveButton(): Locator {
    return this.page.getByRole('button', { name: 'Salvar link' });
  }

  downloadCsvButton(): Locator {
    return this.page.getByRole('button', { name: /Baixar CSV/i });
  }

  emptyState(): Locator {
    return this.page.getByText(/Ainda não existem links/i);
  }

  deleteButtons(): Locator {
    return this.page.getByRole('button', { name: 'Deletar link' });
  }

  shortLink(shortUrl: string): Locator {
    return this.page.getByRole('link', { name: new RegExp(`/${shortUrl}$`) });
  }

  async createLink(originalUrl: string, shortUrl?: string): Promise<void> {
    await this.originalInput().fill(originalUrl);
    if (shortUrl) {
      await this.shortInput().fill(shortUrl);
    }
    await this.saveButton().click();
  }
}
