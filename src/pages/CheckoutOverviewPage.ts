import type { Locator, Page } from '@playwright/test';
import { Routes } from '../actions/NavigationActions';
import { CartItemsComponent } from '../components/CartItemsComponent';
import { parsePrice } from '../utils/currency';
import { step } from '../utils/step';
import { BasePage } from './base/BasePage';

/** Checkout etapa 2: resumo do pedido, com os produtos e os valores. */
export class CheckoutOverviewPage extends BasePage {
  protected readonly route = Routes.checkoutOverview;

  readonly cartItems: CartItemsComponent; // lista de produtos do pedido
  readonly pageTitle: Locator; // título "Checkout: Overview"
  readonly paymentInfo: Locator; // informação de pagamento
  readonly shippingInfo: Locator; // informação de entrega
  readonly subtotalLabel: Locator; // texto do subtotal (ex.: "Item total: $39.98")
  readonly taxLabel: Locator; // texto da taxa
  readonly totalLabel: Locator; // texto do total
  readonly finishButton: Locator; // botão "Finish"
  readonly cancelButton: Locator; // botão "Cancel"

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

  // Os três métodos abaixo leem o texto da tela e convertem para número (ex.: "Tax: $3.20" → 3.2).

  /** Retorna o subtotal (soma dos produtos, sem taxa). */
  async getSubtotal(): Promise<number> {
    return parsePrice(await this.subtotalLabel.innerText());
  }

  /** Retorna o valor da taxa. */
  async getTax(): Promise<number> {
    return parsePrice(await this.taxLabel.innerText());
  }

  /** Retorna o total (subtotal + taxa). */
  async getTotal(): Promise<number> {
    return parsePrice(await this.totalLabel.innerText());
  }

  /** Clica em Finish para concluir o pedido. */
  @step('Finalizar o pedido')
  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
