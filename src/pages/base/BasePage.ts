import type { Page } from '@playwright/test';
import { NavigationActions, type Route } from '../../actions/NavigationActions';
import { Logger } from '../../utils/Logger';
import { step } from '../../utils/step';

/**
 * Página base: comportamento comum a TODAS as páginas (abrir, ler título, ler URL).
 * As outras páginas fazem "extends BasePage" e herdam esses métodos.
 * Mantenha esta classe pequena: o que é específico de uma página fica na classe dela.
 * "abstract" significa que esta classe não é usada sozinha, só como base para as outras.
 */
export abstract class BasePage {
  protected readonly logger: Logger; // escreve mensagens no terminal (protected: só as páginas filhas usam)
  private readonly navigation: NavigationActions; // usado para abrir as páginas (private: só esta classe usa)

  /** Rota que abre esta página (ex.: '/cart.html'). Cada página filha é obrigada a informar a sua. */
  protected abstract readonly route: Route;

  constructor(protected readonly page: Page) {
    // this.constructor.name é o nome da classe filha (ex.: "LoginPage"), usado como prefixo no log.
    this.logger = new Logger(this.constructor.name);
    this.navigation = new NavigationActions(page);
  }

  /** Abre a página no navegador, usando a rota definida na página filha. */
  @step('Abrir a página')
  async open(): Promise<void> {
    this.logger.debug(`Abrindo ${this.route}`);
    await this.navigation.goTo(this.route);
  }

  /** Retorna o título da aba do navegador (ex.: "Swag Labs"). */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /** Retorna a URL atual do navegador. */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Expressão regular para conferir se estamos nesta página.
   * Uso no teste: await expect(page).toHaveURL(cartPage.urlPattern).
   * "get" faz isso funcionar como uma propriedade (sem parênteses).
   */
  get urlPattern(): RegExp {
    return NavigationActions.urlPattern(this.route);
  }
}
