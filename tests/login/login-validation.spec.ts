import { Routes } from '../../src/actions/NavigationActions';
import { loginMessages } from '../../src/data/users';
import { expect, test } from '../../src/fixtures/testFixtures';
import { TestDataFactory } from '../../src/utils/TestDataFactory';

test.describe('Login - validações', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('Deve exibir mensagem de erro para credenciais inválidas', async ({ loginPage, page }) => {
    await loginPage.login(TestDataFactory.invalidCredentials());

    await expect(loginPage.errorMessage).toHaveText(loginMessages.invalidCredentials);
    await expect(page).toHaveURL(loginPage.urlPattern);
  });

  test('Deve validar o preenchimento do usuário obrigatório', async ({ loginPage }) => {
    await loginPage.login({ username: '', password: 'any_password' });

    await expect(loginPage.errorMessage).toHaveText(loginMessages.usernameRequired);
  });

  test('Deve validar o preenchimento da senha obrigatória', async ({ loginPage }) => {
    await loginPage.login({ username: 'any_user', password: '' });

    await expect(loginPage.errorMessage).toHaveText(loginMessages.passwordRequired);
  });

  test('Deve impedir o acesso direto à página interna sem autenticação', async ({
    homePage,
    loginPage,
    page,
  }) => {
    await homePage.open();

    await expect(page).toHaveURL(loginPage.urlPattern);
    await expect(loginPage.errorMessage).toHaveText(
      loginMessages.protectedRoute(Routes.inventory),
    );
  });
});
