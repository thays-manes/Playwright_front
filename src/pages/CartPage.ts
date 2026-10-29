import type { Locator, Page } from '@playwright/test';
import { Routes } from '../actions/NavigationActions';
import { CartItemsComponent } from '../components/CartItemsComponent';
import { HeaderComponent } from '../components/HeaderComponent';
import { step } from '../utils/step';
import { BasePage } from './base/BasePage';

/** Página do carrinho de compras. */
export class CartPage extends BasePage {
  protected readonly route = Routes.cart;

  readonly header: HeaderComponent; // cabeçalho (logo, menu, carrinho)
  readonly cartItems: CartItemsComponent; // lista de produtos no carrinho
  readonly pageTitle: Locator; // título "Your Cart"
  readonly continueShoppingButton: Locator; // botão "Continue Shopping"
  readonly checkoutButton: Locator; // botão "Checkout"

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.cartItems = new CartItemsComponent(page);
    this.pageTitle = page.getByTestId('title');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  /** Clica em "Remove" no produto informado. */
  @step((productName: string) => `Remover "${productName}" no carrinho`)
  async removeItem(productName: string): Promise<void> {
    await this.cartItems.item(productName).getByRole('button', { name: 'Remove' }).click();
  }

  /** Volta para o catálogo de produtos. */
  @step('Continuar comprando')
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  /** Vai para a primeira etapa do checkout (dados do comprador). */
  @step('Iniciar o checkout')
  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
