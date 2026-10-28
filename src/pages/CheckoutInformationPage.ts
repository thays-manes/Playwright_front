import type { Locator, Page } from '@playwright/test';
import { FormActions } from '../actions/FormActions';
import { Routes } from '../actions/NavigationActions';
import type { CustomerInfo } from '../types';
import { step } from '../utils/step';
import { BasePage } from './base/BasePage';

/** Checkout step 1: buyer information. */
export class CheckoutInformationPage extends BasePage {
  protected readonly route = Routes.checkoutInformation;

  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

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

  async fillInformation({ firstName, lastName, postalCode }: CustomerInfo): Promise<void> {
    await FormActions.fillFields([
      { locator: this.firstNameInput, value: firstName },
      { locator: this.lastNameInput, value: lastName },
      { locator: this.postalCodeInput, value: postalCode },
    ]);
  }

  @step('Preencher os dados do comprador e continuar')
  async submitInformation(customer: CustomerInfo): Promise<void> {
    await this.fillInformation(customer);
    await FormActions.submit(this.continueButton);
  }

  @step('Cancelar o checkout')
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
