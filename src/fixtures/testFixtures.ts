// Importamos o "test" original do Playwright com o apelido "base", porque vamos criar um "test" nosso.
import { test as base, expect } from '@playwright/test';
import { users } from '../data/users';
import { CartPage } from '../pages/CartPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

// Lista das fixtures (objetos prontos) que os testes podem pedir, e o tipo de cada uma.
interface PageFixtures {
  loginPage: LoginPage;
  homePage: HomePage;
  /** Página inicial já com o login feito pelo usuário padrão. */
  authenticatedHomePage: HomePage;
  cartPage: CartPage;
  checkoutInformationPage: CheckoutInformationPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
}

/**
 * Fixtures = objetos que o Playwright cria automaticamente para cada teste.
 * No teste basta pedir pelo nome, ex.: test('...', async ({ loginPage }) => { ... }).
 * Cada fixture é criada de novo para cada teste usando a "page" do próprio teste,
 * então testes rodando em paralelo nunca compartilham o mesmo navegador.
 *
 * Formato de cada fixture: async ({ o que ela precisa }, use) => { prepara; await use(objeto); }
 * O "use" entrega o objeto para o teste.
 */
export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  // Esta fixture usa outras duas (loginPage e homePage): abre o login, entra com o usuário padrão,
  // confere que a página inicial apareceu e só então entrega a homePage para o teste.
  authenticatedHomePage: async ({ loginPage, homePage }, use) => {
    await loginPage.open();
    await loginPage.login(users.standard());
    await expect(homePage.pageTitle).toBeVisible();
    await use(homePage);
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutInformationPage: async ({ page }, use) => {
    await use(new CheckoutInformationPage(page));
  },

  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },

  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
});

// Exporta o expect junto, para os testes importarem "test" e "expect" do mesmo lugar.
export { expect };
