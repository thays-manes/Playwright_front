import type { Locator, Page } from '@playwright/test';
import { Routes } from '../actions/NavigationActions';
import { HeaderComponent } from '../components/HeaderComponent';
import type { ProductSortOption } from '../types';
import { parsePrice } from '../utils/currency';
import { step } from '../utils/step';
import { BasePage } from './base/BasePage';

/** Página inicial depois do login: o catálogo de produtos. */
export class HomePage extends BasePage {
  protected readonly route = Routes.inventory;

  readonly header: HeaderComponent; // cabeçalho (logo, menu, carrinho)
  readonly pageTitle: Locator; // título "Products"
  readonly productItems: Locator; // todos os cards de produto
  readonly productNames: Locator; // nomes dos produtos
  readonly productPrices: Locator; // preços dos produtos
  readonly sortSelect: Locator; // lista de ordenação (A-Z, Z-A, preço...)

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.pageTitle = page.getByTestId('title');
    this.productItems = page.getByTestId('inventory-item');
    this.productNames = page.getByTestId('inventory-item-name');
    this.productPrices = page.getByTestId('inventory-item-price');
    this.sortSelect = page.getByTestId('product-sort-container');
  }

  /** Retorna o card do produto que contém o nome informado. */
  productCard(productName: string): Locator {
    return this.productItems.filter({ hasText: productName });
  }

  /** Clica em "Add to cart" no card do produto. */
  @step((productName: string) => `Adicionar "${productName}" ao carrinho`)
  async addToCart(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  /** Clica em "Remove" no card do produto. */
  @step((productName: string) => `Remover "${productName}" do carrinho`)
  async removeFromCart(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: 'Remove' }).click();
  }

  /** Escolhe a ordenação: 'az', 'za', 'lohi' (menor preço) ou 'hilo' (maior preço). */
  @step((option: ProductSortOption) => `Ordenar produtos por "${option}"`)
  async sortBy(option: ProductSortOption): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  /** Retorna os nomes de todos os produtos, na ordem em que aparecem na tela. */
  async getProductNames(): Promise<string[]> {
    return this.productNames.allInnerTexts();
  }

  /** Retorna os preços como números, na ordem em que aparecem na tela. */
  async getProductPrices(): Promise<number[]> {
    const prices = await this.productPrices.allInnerTexts();
    return prices.map(parsePrice);
  }
}
