import type { Locator, Page } from '@playwright/test';
import { Routes } from '../actions/NavigationActions';
import { HeaderComponent } from '../components/HeaderComponent';
import type { ProductSortOption } from '../types';
import { parsePrice } from '../utils/currency';
import { step } from '../utils/step';
import { BasePage } from './base/BasePage';

/** Home page after login: the product catalog (inventory). */
export class HomePage extends BasePage {
  protected readonly route = Routes.inventory;

  readonly header: HeaderComponent;
  readonly pageTitle: Locator;
  readonly productItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.pageTitle = page.getByTestId('title');
    this.productItems = page.getByTestId('inventory-item');
    this.productNames = page.getByTestId('inventory-item-name');
    this.productPrices = page.getByTestId('inventory-item-price');
    this.sortSelect = page.getByTestId('product-sort-container');
  }

  productCard(productName: string): Locator {
    return this.productItems.filter({ hasText: productName });
  }

  @step((productName: string) => `Adicionar "${productName}" ao carrinho`)
  async addToCart(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  @step((productName: string) => `Remover "${productName}" do carrinho`)
  async removeFromCart(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: 'Remove' }).click();
  }

  @step((option: ProductSortOption) => `Ordenar produtos por "${option}"`)
  async sortBy(option: ProductSortOption): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return this.productNames.allInnerTexts();
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.productPrices.allInnerTexts();
    return prices.map(parsePrice);
  }
}
