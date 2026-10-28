import { test as base, expect } from '@playwright/test';
import { users } from '../data/users';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

interface PageFixtures {
  loginPage: LoginPage;
  homePage: HomePage;
  /** HomePage already authenticated with the standard user. */
  authenticatedHomePage: HomePage;
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
});

export { expect };
