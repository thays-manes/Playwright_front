import * as allure from 'allure-js-commons';
import { products } from '../../src/data/products';
import { hasStandardUser } from '../../src/data/users';
import { expect, test } from '../../src/fixtures/testFixtures';

test.describe('Página inicial', () => {
  // Pula TODOS os testes deste grupo se o .env não tiver usuário e senha.
  test.skip(!hasStandardUser(), 'Defina TEST_USERNAME e TEST_PASSWORD no .env');

  // Antes de cada teste: classifica no Allure (Épico "Catálogo" > Funcionalidade "Página inicial").
  test.beforeEach(async () => {
    await allure.epic('Catálogo');
    await allure.feature('Página inicial');
  });

  // "authenticatedHomePage: homePage" = pede a fixture que já faz login e a renomeia para homePage.
  test('Deve carregar os elementos principais da página inicial', async ({
    authenticatedHomePage: homePage,
  }) => {
    await allure.severity(allure.Severity.CRITICAL);
    // Confere o título da aba e se os principais elementos estão visíveis.
    expect(await homePage.getTitle()).toBe('Swag Labs');
    await expect(homePage.header.logo).toBeVisible();
    await expect(homePage.header.menu.openButton).toBeVisible();
    await expect(homePage.header.cartLink).toBeVisible();
    await expect(homePage.pageTitle).toHaveText('Products');
    await expect(homePage.sortSelect).toBeVisible();
    // first() = o primeiro produto da lista. Basta um visível para saber que o catálogo carregou.
    await expect(homePage.productItems.first()).toBeVisible();
  });

  // A tag @destructive no nome faz este teste não rodar em produção (mexe no carrinho).
  test('Deve atualizar o contador do carrinho ao adicionar e remover produtos @destructive', async ({
    authenticatedHomePage: homePage,
  }) => {
    await allure.severity(allure.Severity.CRITICAL);
    // No início o carrinho está vazio, então o contador não aparece.
    await expect(homePage.header.cartBadge).toBeHidden();

    // Adiciona 2 produtos → contador mostra 2.
    await homePage.addToCart(products.backpack);
    await homePage.addToCart(products.bikeLight);
    await expect(homePage.header.cartBadge).toHaveText('2');

    // Remove 1 produto → contador mostra 1.
    await homePage.removeFromCart(products.backpack);
    await expect(homePage.header.cartBadge).toHaveText('1');
  });

  test('Deve ordenar os produtos por preço crescente', async ({ authenticatedHomePage: homePage }) => {
    await allure.severity(allure.Severity.MINOR);
    // Ação: escolhe "Price (low to high)".
    await homePage.sortBy('lohi');

    // Lê os preços na ordem da tela e compara com a mesma lista ordenada do menor para o maior.
    // [...prices] cria uma cópia, para o sort() não alterar a lista original.
    const prices = await homePage.getProductPrices();
    expect(prices.length).toBeGreaterThan(1);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('Deve ordenar os produtos por nome de Z a A', async ({ authenticatedHomePage: homePage }) => {
    await allure.severity(allure.Severity.MINOR);
    // Ação: escolhe "Name (Z to A)".
    await homePage.sortBy('za');

    // Lê os nomes e compara com a mesma lista em ordem alfabética invertida.
    // localeCompare compara textos em ordem alfabética.
    const names = await homePage.getProductNames();
    expect(names.length).toBeGreaterThan(1);
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });
});
