import { hasLockedOutUser, hasStandardUser, loginMessages, users } from '../../src/data/users';
import { expect, test } from '../../src/fixtures/testFixtures';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('Deve permitir acesso com credenciais válidas', async ({ loginPage, homePage, page }) => {
    test.skip(!hasStandardUser(), 'Defina TEST_USERNAME e TEST_PASSWORD no .env');

    await loginPage.login(users.standard());

    await expect(page).toHaveURL(homePage.urlPattern);
    await expect(homePage.pageTitle).toHaveText('Products');
    await expect(loginPage.errorMessage).toBeHidden();
  });

  test('Deve bloquear o acesso de usuário bloqueado', async ({ loginPage, page }) => {
    test.skip(!hasLockedOutUser(), 'Defina TEST_LOCKED_USERNAME e TEST_PASSWORD no .env');

    await loginPage.login(users.lockedOut());

    await expect(loginPage.errorMessage).toHaveText(loginMessages.lockedOut);
    await expect(page).toHaveURL(loginPage.urlPattern);
  });

  test('Deve encerrar a sessão ao fazer logout', async ({ loginPage, homePage, page }) => {
    test.skip(!hasStandardUser(), 'Defina TEST_USERNAME e TEST_PASSWORD no .env');

    await loginPage.login(users.standard());
    await expect(homePage.pageTitle).toBeVisible();

    await homePage.header.menu.logout();

    await expect(page).toHaveURL(loginPage.urlPattern);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
