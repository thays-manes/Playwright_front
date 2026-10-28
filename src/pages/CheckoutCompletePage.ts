import type { Locator, Page } from '@playwright/test';
import { Routes } from '../actions/NavigationActions';
import { HeaderComponent } from '../components/HeaderComponent';
import { step } from '../utils/step';
import { BasePage } from './base/BasePage';

/** Order confirmation page. */
export class CheckoutCompletePage extends BasePage {
  protected readonly route = Routes.checkoutComplete;

  readonly header: HeaderComponent;
  readonly pageTitle: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.pageTitle = page.getByTestId('title');
    this.completeHeader = page.getByTestId('complete-header');
    this.completeText = page.getByTestId('complete-text');
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
  }

  @step('Voltar para a página inicial')
  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
