import type { Locator, Page } from '@playwright/test';
import { FormActions } from '../actions/FormActions';
import { Routes } from '../actions/NavigationActions';
import type { UserCredentials } from '../types';
import { step } from '../utils/step';
import { BasePage } from './base/BasePage';

/**
 * Page Object da tela de login.
 * Page Object = uma classe por página, com os elementos da tela e as ações possíveis nela.
 * Assim os testes não precisam saber COMO encontrar cada campo.
 */
export class LoginPage extends BasePage {
  // Rota desta página (exigida pela BasePage).
  protected readonly route = Routes.login;

  readonly usernameInput: Locator; // campo "Username"
  readonly passwordInput: Locator; // campo "Password"
  readonly loginButton: Locator; // botão "Login"
  readonly errorMessage: Locator; // mensagem de erro em vermelho

  constructor(page: Page) {
    // super(page) chama o construtor da BasePage.
    super(page);
    // Preferimos localizar como um usuário enxerga a tela (placeholder, texto do botão).
    // Usamos data-test (getByTestId) só quando o elemento não tem um texto acessível.
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByTestId('error');
  }

  /** Preenche usuário e senha (sem clicar em Login). */
  async fillCredentials({ username, password }: UserCredentials): Promise<void> {
    await FormActions.fillFields([
      { locator: this.usernameInput, value: username },
      { locator: this.passwordInput, value: password },
    ]);
  }

  /** Clica no botão Login. */
  async submit(): Promise<void> {
    await FormActions.submit(this.loginButton);
  }

  /**
   * Faz o login completo: preenche os campos e clica em Login.
   * No relatório aparece o passo "Fazer login com o usuário "nome"".
   */
  @step((credentials: UserCredentials) => `Fazer login com o usuário "${credentials.username}"`)
  async login(credentials: UserCredentials): Promise<void> {
    this.logger.info(`Login com usuário "${credentials.username}"`);
    await this.fillCredentials(credentials);
    await this.submit();
  }

  /** Retorna o texto da mensagem de erro. */
  async getErrorMessage(): Promise<string> {
    return this.errorMessage.innerText();
  }
}
