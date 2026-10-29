import type { Locator, Page } from '@playwright/test';
import { parsePrice } from '../utils/currency';

/**
 * Componente = pedaço de tela que se repete em mais de uma página.
 * Este é a lista de produtos que aparece no carrinho e também no resumo do checkout.
 */
export class CartItemsComponent {
  // Locator = "endereço" de um elemento na tela. readonly = não pode ser trocado depois.
  readonly items: Locator; // todos os produtos da lista
  readonly names: Locator; // os nomes dos produtos
  readonly prices: Locator; // os preços dos produtos

  constructor(page: Page) {
    // getByTestId procura pelo atributo data-test do HTML (configurado no playwright.config.ts).
    this.items = page.getByTestId('inventory-item');
    // Procura os nomes e preços DENTRO dos itens da lista.
    this.names = this.items.getByTestId('inventory-item-name');
    this.prices = this.items.getByTestId('inventory-item-price');
  }

  /** Retorna o item da lista que contém o nome do produto informado. */
  item(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  /** Retorna os nomes de todos os produtos da lista, ex.: ['Sauce Labs Backpack', ...]. */
  async getNames(): Promise<string[]> {
    return this.names.allInnerTexts();
  }

  /** Retorna os preços como números, ex.: '$29.99' vira 29.99. */
  async getPrices(): Promise<number[]> {
    const prices = await this.prices.allInnerTexts(); // lê os textos dos preços
    return prices.map(parsePrice); // converte cada texto em número
  }
}
