import { test as base, expect } from '@playwright/test';
import { users } from '../data/users';
import { CartPage } from '../pages/CartPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

interface PageFixtures {
  loginPage: LoginPage;
  homePage: HomePage;
  /** HomePage already authenticated with the standard user. */
  authenticatedHomePage: HomePage;
  cartPage: CartPage;
  checkoutInformationPage: CheckoutInformationPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
}

/**
 * Every fixture is created per test from Playwright's own `page`,
 * so parallel tests never share browser state.
 */
export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

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

export { expect };
