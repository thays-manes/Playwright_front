import type { Locator, Page } from '@playwright/test';

/** Side menu (burger menu), available on every authenticated page. */
export class MenuComponent {
  readonly openButton: Locator;
  readonly closeButton: Locator;
  readonly allItemsLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  constructor(page: Page) {
    this.openButton = page.getByRole('button', { name: 'Open Menu' });
    this.closeButton = page.getByRole('button', { name: 'Close Menu' });
    this.allItemsLink = page.getByTestId('inventory-sidebar-link');
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.resetAppStateLink = page.getByTestId('reset-sidebar-link');
  }

  async open(): Promise<void> {
    await this.openButton.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }

  async logout(): Promise<void> {
    await this.open();
    await this.logoutLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.open();
    await this.resetAppStateLink.click();
    await this.close();
  }
}
