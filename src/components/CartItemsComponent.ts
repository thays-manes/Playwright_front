import type { Locator, Page } from '@playwright/test';
import { parsePrice } from '../utils/currency';

/** List of products shown in both the cart and the checkout overview. */
export class CartItemsComponent {
  readonly items: Locator;
  readonly names: Locator;
  readonly prices: Locator;

  constructor(page: Page) {
    this.items = page.getByTestId('inventory-item');
    this.names = this.items.getByTestId('inventory-item-name');
    this.prices = this.items.getByTestId('inventory-item-price');
  }

  item(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  async getNames(): Promise<string[]> {
    return this.names.allInnerTexts();
  }

  async getPrices(): Promise<number[]> {
    const prices = await this.prices.allInnerTexts();
    return prices.map(parsePrice);
  }
}
