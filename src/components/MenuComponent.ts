import type { Locator, Page } from '@playwright/test';
import { step } from '../utils/step';

/** Menu lateral (ícone de três linhas), disponível em todas as páginas depois do login. */
export class MenuComponent {
  readonly openButton: Locator; // botão que abre o menu
  readonly closeButton: Locator; // botão "X" que fecha o menu
  readonly allItemsLink: Locator; // opção "All Items"
  readonly logoutLink: Locator; // opção "Logout"
  readonly resetAppStateLink: Locator; // opção "Reset App State"

  constructor(page: Page) {
    // getByRole procura pelo papel do elemento (botão, link...) e pelo nome acessível.
    this.openButton = page.getByRole('button', { name: 'Open Menu' });
    this.closeButton = page.getByRole('button', { name: 'Close Menu' });
    this.allItemsLink = page.getByTestId('inventory-sidebar-link');
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.resetAppStateLink = page.getByTestId('reset-sidebar-link');
  }

  // @step('...') é um decorator: faz este método aparecer como um passo com esse nome nos relatórios.
  // (veja src/utils/step.ts)
  @step('Abrir o menu lateral')
  async open(): Promise<void> {
    await this.openButton.click();
  }

  @step('Fechar o menu lateral')
  async close(): Promise<void> {
    await this.closeButton.click();
  }

  /** Abre o menu e clica em Logout. */
  @step('Fazer logout')
  async logout(): Promise<void> {
    await this.open();
    await this.logoutLink.click();
  }

  /** Abre o menu, clica em "Reset App State" (limpa o carrinho) e fecha o menu. */
  @step('Restaurar o estado da aplicação')
  async resetAppState(): Promise<void> {
    await this.open();
    await this.resetAppStateLink.click();
    await this.close();
  }
}
