import type { Page } from '@playwright/test';

/**
 * Endereços (rotas) das páginas do site, sem a URL base.
 * Se uma URL mudar no site, só precisamos alterar aqui.
 * "as const" faz o TypeScript tratar os valores como fixos (não podem ser alterados).
 */
export const Routes = {
  login: '/',
  inventory: '/inventory.html',
  cart: '/cart.html',
  checkoutInformation: '/checkout-step-one.html',
  checkoutOverview: '/checkout-step-two.html',
  checkoutComplete: '/checkout-complete.html',
} as const;

// Tipo "Route": aceita somente um dos valores de Routes acima (ex.: '/cart.html').
// Assim o TypeScript acusa erro se alguém digitar uma rota que não existe.
export type Route = (typeof Routes)[keyof typeof Routes];

/** Ações de navegação entre páginas, que não pertencem a uma página específica. */
export class NavigationActions {
  // Recebe a "page" do Playwright (a aba do navegador) e guarda para usar nos métodos.
  constructor(private readonly page: Page) {}

  /** Abre a rota informada. O Playwright junta a rota com a baseURL do playwright.config.ts. */
  async goTo(route: Route): Promise<void> {
    await this.page.goto(route);
  }

  /**
   * Cria uma expressão regular (RegExp) que confere se a URL atual TERMINA com a rota.
   * Usada nos testes com expect(page).toHaveURL(...).
   */
  static urlPattern(route: Route): RegExp {
    // Coloca "\" antes de caracteres especiais (como o ".") para eles serem lidos como texto comum.
    const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // O "$" no final significa "termina com".
    return new RegExp(`${escaped}$`);
  }
}
