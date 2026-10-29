// allure-js-commons: funções para enriquecer o relatório Allure (épico, funcionalidade, severidade...).
import * as allure from 'allure-js-commons';
import { hasLockedOutUser, hasStandardUser, loginMessages, users } from '../../src/data/users';
// Usamos o "test" das nossas fixtures (e não o do Playwright) para ter loginPage, homePage etc.
import { expect, test } from '../../src/fixtures/testFixtures';

// describe agrupa os testes de login. No relatório aparecem juntos.
test.describe('Login', () => {
  // beforeEach roda ANTES de cada teste deste grupo.
  test.beforeEach(async ({ loginPage }) => {
    // Classificação no Allure: Épico "Autenticação" > Funcionalidade "Login".
    await allure.epic('Autenticação');
    await allure.feature('Login');
    // Abre a tela de login.
    await loginPage.open();
  });

  test('Deve permitir acesso com credenciais válidas', async ({ loginPage, homePage, page }) => {
    // Pula o teste se o .env não tiver usuário e senha (com a mensagem explicando o motivo).
    test.skip(!hasStandardUser(), 'Defina TEST_USERNAME e TEST_PASSWORD no .env');
    // Severidade no Allure: BLOCKER = se falhar, impede o uso do sistema.
    await allure.severity(allure.Severity.BLOCKER);

    // Ação: faz login com o usuário padrão.
    await loginPage.login(users.standard());

    // Validações: foi para a página de produtos e não apareceu mensagem de erro.
    await expect(page).toHaveURL(homePage.urlPattern);
    await expect(homePage.pageTitle).toHaveText('Products');
    await expect(loginPage.errorMessage).toBeHidden();
  });

  test('Deve bloquear o acesso de usuário bloqueado', async ({ loginPage, page }) => {
    test.skip(!hasLockedOutUser(), 'Defina TEST_LOCKED_USERNAME e TEST_PASSWORD no .env');
    await allure.severity(allure.Severity.CRITICAL);

    // Ação: tenta entrar com o usuário bloqueado.
    await loginPage.login(users.lockedOut());

    // Validações: aparece a mensagem de bloqueio e continua na tela de login.
    await expect(loginPage.errorMessage).toHaveText(loginMessages.lockedOut);
    await expect(page).toHaveURL(loginPage.urlPattern);
  });

  test('Deve encerrar a sessão ao fazer logout', async ({ loginPage, homePage, page }) => {
    test.skip(!hasStandardUser(), 'Defina TEST_USERNAME e TEST_PASSWORD no .env');
    await allure.severity(allure.Severity.CRITICAL);

    // Pré-condição: estar logado.
    await loginPage.login(users.standard());
    await expect(homePage.pageTitle).toBeVisible();

    // Ação: faz logout pelo menu lateral.
    await homePage.header.menu.logout();

    // Validações: voltou para a tela de login.
    await expect(page).toHaveURL(loginPage.urlPattern);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
