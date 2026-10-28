import * as allure from 'allure-js-commons';
import { products } from '../../src/data/products';
import { hasStandardUser } from '../../src/data/users';
import { expect, test } from '../../src/fixtures/testFixtures';

test.describe('Página inicial', () => {
  test.skip(!hasStandardUser(), 'Defina TEST_USERNAME e TEST_PASSWORD no .env');

  test.beforeEach(async () => {
    await allure.epic('Catálogo');
    await allure.feature('Página inicial');
  });

  test('Deve carregar os elementos principais da página inicial', async ({
    authenticatedHomePage: homePage,
  }) => {
    await allure.severity(allure.Severity.CRITICAL);
    expect(await homePage.getTitle()).toBe('Swag Labs');
    await expect(homePage.header.logo).toBeVisible();
    await expect(homePage.header.menu.openButton).toBeVisible();
    await expect(homePage.header.cartLink).toBeVisible();
    await expect(homePage.pageTitle).toHaveText('Products');
    await expect(homePage.sortSelect).toBeVisible();
    await expect(homePage.productItems.first()).toBeVisible();
  });

  test('Deve atualizar o contador do carrinho ao adicionar e remover produtos @destructive', async ({
    authenticatedHomePage: homePage,
  }) => {
    await allure.severity(allure.Severity.CRITICAL);
    await expect(homePage.header.cartBadge).toBeHidden();

    await homePage.addToCart(products.backpack);
    await homePage.addToCart(products.bikeLight);
    await expect(homePage.header.cartBadge).toHaveText('2');

    await homePage.removeFromCart(products.backpack);
    await expect(homePage.header.cartBadge).toHaveText('1');
  });

  test('Deve ordenar os produtos por preço crescente', async ({ authenticatedHomePage: homePage }) => {
    await allure.severity(allure.Severity.MINOR);
    await homePage.sortBy('lohi');

    const prices = await homePage.getProductPrices();
    expect(prices.length).toBeGreaterThan(1);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('Deve ordenar os produtos por nome de Z a A', async ({ authenticatedHomePage: homePage }) => {
    await allure.severity(allure.Severity.MINOR);
    await homePage.sortBy('za');

    const names = await homePage.getProductNames();
    expect(names.length).toBeGreaterThan(1);
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });
});
