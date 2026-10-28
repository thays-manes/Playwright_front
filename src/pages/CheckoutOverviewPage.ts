import type { Locator, Page } from '@playwright/test';
import { Routes } from '../actions/NavigationActions';
import { CartItemsComponent } from '../components/CartItemsComponent';
import { parsePrice } from '../utils/currency';
import { step } from '../utils/step';
import { BasePage } from './base/BasePage';

/** Checkout step 2: order summary with items and amounts. */
export class CheckoutOverviewPage extends BasePage {
  protected readonly route = Routes.checkoutOverview;

  readonly cartItems: CartItemsComponent;
  readonly pageTitle: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = new CartItemsComponent(page);
    this.pageTitle = page.getByTestId('title');
    this.paymentInfo = page.getByTestId('payment-info-value');
    this.shippingInfo = page.getByTestId('shipping-info-value');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async getSubtotal(): Promise<number> {
    return parsePrice(await this.subtotalLabel.innerText());
  }

  async getTax(): Promise<number> {
    return parsePrice(await this.taxLabel.innerText());
  }

  async getTotal(): Promise<number> {
    return parsePrice(await this.totalLabel.innerText());
  }

  @step('Finalizar o pedido')
  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
