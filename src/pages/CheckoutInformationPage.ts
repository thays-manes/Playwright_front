import type { Locator, Page } from '@playwright/test';
import { FormActions } from '../actions/FormActions';
import { Routes } from '../actions/NavigationActions';
import type { CustomerInfo } from '../types';
import { step } from '../utils/step';
import { BasePage } from './base/BasePage';

/** Checkout etapa 1: formulário com os dados do comprador. */
export class CheckoutInformationPage extends BasePage {
  protected readonly route = Routes.checkoutInformation;

  readonly pageTitle: Locator; // título "Checkout: Your Information"
  readonly firstNameInput: Locator; // campo nome
  readonly lastNameInput: Locator; // campo sobrenome
  readonly postalCodeInput: Locator; // campo CEP
  readonly continueButton: Locator; // botão "Continue"
  readonly cancelButton: Locator; // botão "Cancel"
  readonly errorMessage: Locator; // mensagem de erro (campo obrigatório)

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByTestId('title');
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.errorMessage = page.getByTestId('error');
  }

  /** Preenche nome, sobrenome e CEP (sem clicar em Continue). */
  async fillInformation({ firstName, lastName, postalCode }: CustomerInfo): Promise<void> {
    await FormActions.fillFields([
      { locator: this.firstNameInput, value: firstName },
      { locator: this.lastNameInput, value: lastName },
      { locator: this.postalCodeInput, value: postalCode },
    ]);
  }

  /** Preenche os dados e clica em Continue. */
  @step('Preencher os dados do comprador e continuar')
  async submitInformation(customer: CustomerInfo): Promise<void> {
    await this.fillInformation(customer);
    await FormActions.submit(this.continueButton);
  }

  /** Clica em Cancel (volta para o carrinho). */
  @step('Cancelar o checkout')
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
