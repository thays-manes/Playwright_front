import type { Locator, Page } from '@playwright/test';
import { step } from '../utils/step';

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

  @step('Abrir o menu lateral')
  async open(): Promise<void> {
    await this.openButton.click();
  }

  @step('Fechar o menu lateral')
  async close(): Promise<void> {
    await this.closeButton.click();
  }

  @step('Fazer logout')
  async logout(): Promise<void> {
    await this.open();
    await this.logoutLink.click();
  }

  @step('Restaurar o estado da aplicação')
  async resetAppState(): Promise<void> {
    await this.open();
    await this.resetAppStateLink.click();
    await this.close();
  }
}
