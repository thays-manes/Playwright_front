import * as allure from 'allure-js-commons';
import { Routes } from '../../src/actions/NavigationActions';
import { loginMessages } from '../../src/data/users';
import { expect, test } from '../../src/fixtures/testFixtures';
import { TestDataFactory } from '../../src/utils/TestDataFactory';

// Testes negativos de login: dados errados ou faltando. Não precisam de usuário no .env.
test.describe('Login - validações', () => {
  // Antes de cada teste: classifica no Allure e abre a tela de login.
  test.beforeEach(async ({ loginPage }) => {
    await allure.epic('Autenticação');
    await allure.feature('Validações de login');
    await loginPage.open();
  });

  test('Deve exibir mensagem de erro para credenciais inválidas', async ({ loginPage, page }) => {
    await allure.severity(allure.Severity.CRITICAL);
    // Ação: login com usuário e senha gerados aleatoriamente (que não existem).
    await loginPage.login(TestDataFactory.invalidCredentials());

    // Validações: mensagem de credenciais inválidas e continua na tela de login.
    await expect(loginPage.errorMessage).toHaveText(loginMessages.invalidCredentials);
    await expect(page).toHaveURL(loginPage.urlPattern);
  });

  test('Deve validar o preenchimento do usuário obrigatório', async ({ loginPage }) => {
    await allure.severity(allure.Severity.NORMAL);
    // Ação: login com o usuário vazio.
    await loginPage.login({ username: '', password: 'any_password' });

    // Validação: mensagem "Username is required".
    await expect(loginPage.errorMessage).toHaveText(loginMessages.usernameRequired);
  });

  test('Deve validar o preenchimento da senha obrigatória', async ({ loginPage }) => {
    await allure.severity(allure.Severity.NORMAL);
    // Ação: login com a senha vazia.
    await loginPage.login({ username: 'any_user', password: '' });

    // Validação: mensagem "Password is required".
    await expect(loginPage.errorMessage).toHaveText(loginMessages.passwordRequired);
  });

  test('Deve impedir o acesso direto à página interna sem autenticação', async ({
    homePage,
    loginPage,
    page,
  }) => {
    await allure.severity(allure.Severity.BLOCKER);
    // Ação: tenta abrir a página de produtos direto pela URL, sem ter feito login.
    await homePage.open();

    // Validações: o site redireciona para o login e mostra a mensagem de acesso restrito.
    await expect(page).toHaveURL(loginPage.urlPattern);
    await expect(loginPage.errorMessage).toHaveText(
      loginMessages.protectedRoute(Routes.inventory),
    );
  });
});
