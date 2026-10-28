import type { Locator, Page } from '@playwright/test';
import { Routes } from '../actions/NavigationActions';
import { CartItemsComponent } from '../components/CartItemsComponent';
import { HeaderComponent } from '../components/HeaderComponent';
import { step } from '../utils/step';
import { BasePage } from './base/BasePage';

export class CartPage extends BasePage {
  protected readonly route = Routes.cart;

  readonly header: HeaderComponent;
  readonly cartItems: CartItemsComponent;
  readonly pageTitle: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.cartItems = new CartItemsComponent(page);
    this.pageTitle = page.getByTestId('title');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  @step((productName: string) => `Remover "${productName}" no carrinho`)
  async removeItem(productName: string): Promise<void> {
    await this.cartItems.item(productName).getByRole('button', { name: 'Remove' }).click();
  }

  @step('Continuar comprando')
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  @step('Iniciar o checkout')
  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
