import type { Locator, Page } from '@playwright/test';
import { Routes } from '../actions/NavigationActions';
import { HeaderComponent } from '../components/HeaderComponent';
import { step } from '../utils/step';
import { BasePage } from './base/BasePage';

/** Página de confirmação, exibida depois que o pedido é finalizado. */
export class CheckoutCompletePage extends BasePage {
  protected readonly route = Routes.checkoutComplete;

  readonly header: HeaderComponent; // cabeçalho (usado para conferir que o carrinho ficou vazio)
  readonly pageTitle: Locator; // título "Checkout: Complete!"
  readonly completeHeader: Locator; // "Thank you for your order!"
  readonly completeText: Locator; // texto de confirmação do pedido
  readonly backHomeButton: Locator; // botão "Back Home"

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.pageTitle = page.getByTestId('title');
    this.completeHeader = page.getByTestId('complete-header');
    this.completeText = page.getByTestId('complete-text');
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
  }

  /** Clica em "Back Home" para voltar ao catálogo de produtos. */
  @step('Voltar para a página inicial')
  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
