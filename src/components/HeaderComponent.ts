import type { Locator, Page } from '@playwright/test';
import { MenuComponent } from './MenuComponent';

/** Cabeçalho do topo, presente em todas as páginas depois do login: logo, menu e carrinho. */
export class HeaderComponent {
  readonly logo: Locator; // texto "Swag Labs"
  readonly cartLink: Locator; // ícone do carrinho
  readonly cartBadge: Locator; // bolinha com a quantidade de itens no carrinho
  readonly menu: MenuComponent; // menu lateral (é outro componente, usado aqui dentro)

  constructor(page: Page) {
    // Área do cabeçalho; o logo é procurado só dentro dela.
    const container = page.getByTestId('primary-header');
    this.logo = container.getByText('Swag Labs');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.menu = new MenuComponent(page);
  }

  /** Clica no ícone do carrinho para abrir a página do carrinho. */
  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
