import type { Locator, Page } from '@playwright/test';
import { FormActions } from '../actions/FormActions';
import { Routes } from '../actions/NavigationActions';
import type { UserCredentials } from '../types';
import { step } from '../utils/step';
import { BasePage } from './base/BasePage';

export class LoginPage extends BasePage {
  protected readonly route = Routes.login;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    // Accessible locators first; data-test only where the app has no accessible name.
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByTestId('error');
  }

  async fillCredentials({ username, password }: UserCredentials): Promise<void> {
    await FormActions.fillFields([
      { locator: this.usernameInput, value: username },
      { locator: this.passwordInput, value: password },
    ]);
  }

  async submit(): Promise<void> {
    await FormActions.submit(this.loginButton);
  }

  @step((credentials: UserCredentials) => `Fazer login com o usuário "${credentials.username}"`)
  async login(credentials: UserCredentials): Promise<void> {
    this.logger.info(`Login com usuário "${credentials.username}"`);
    await this.fillCredentials(credentials);
    await this.submit();
  }

  async getErrorMessage(): Promise<string> {
    return this.errorMessage.innerText();
  }
}
