import type { Locator, Page } from '@playwright/test';
import { MenuComponent } from './MenuComponent';

/** Top header shared by every authenticated page: logo, menu and cart. */
export class HeaderComponent {
  readonly logo: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menu: MenuComponent;

  constructor(page: Page) {
    const container = page.getByTestId('primary-header');
    this.logo = container.getByText('Swag Labs');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.menu = new MenuComponent(page);
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
