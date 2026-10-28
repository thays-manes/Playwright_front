import * as allure from 'allure-js-commons';
import { checkoutMessages, pageTitles } from '../../src/data/checkout';
import { products } from '../../src/data/products';
import { hasStandardUser } from '../../src/data/users';
import { expect, test } from '../../src/fixtures/testFixtures';
import type { CustomerInfo } from '../../src/types';
import { roundToCents } from '../../src/utils/currency';
import { TestDataFactory } from '../../src/utils/TestDataFactory';

// Purchases create orders: never run against production (see grepInvert in playwright.config.ts).
test.describe('Checkout', { tag: '@destructive' }, () => {
  test.skip(!hasStandardUser(), 'Defina TEST_USERNAME e TEST_PASSWORD no .env');

  test.beforeEach(async () => {
    await allure.epic('Compras');
    await allure.feature('Checkout');
  });

  test('Deve concluir uma compra de ponta a ponta com sucesso', async ({
    authenticatedHomePage: homePage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    page,
  }) => {
    await allure.severity(allure.Severity.BLOCKER);
    await allure.story('Compra completa');
    const selectedProducts = [products.backpack, products.bikeLight];

    await test.step('Adicionar produtos ao carrinho', async () => {
      for (const product of selectedProducts) {
        await homePage.addToCart(product);
      }
      await expect(homePage.header.cartBadge).toHaveText(String(selectedProducts.length));
    });

    await test.step('Conferir o carrinho', async () => {
      await homePage.header.openCart();
      await expect(page).toHaveURL(cartPage.urlPattern);
      await expect(cartPage.pageTitle).toHaveText(pageTitles.cart);
      await expect(cartPage.cartItems.names).toHaveText(selectedProducts);
    });

    await test.step('Informar os dados do comprador', async () => {
      await cartPage.checkout();
      await expect(checkoutInformationPage.pageTitle).toHaveText(pageTitles.checkoutInformation);
      await checkoutInformationPage.submitInformation(TestDataFactory.customer());
    });

    await test.step('Conferir o resumo do pedido', async () => {
      await expect(page).toHaveURL(checkoutOverviewPage.urlPattern);
      await expect(checkoutOverviewPage.pageTitle).toHaveText(pageTitles.checkoutOverview);
      await expect(checkoutOverviewPage.cartItems.names).toHaveText(selectedProducts);
      await expect(checkoutOverviewPage.paymentInfo).not.toBeEmpty();
      await expect(checkoutOverviewPage.shippingInfo).not.toBeEmpty();
    });

    await checkoutOverviewPage.finish();

    await test.step('Validar a confirmação do pedido', async () => {
      await expect(page).toHaveURL(checkoutCompletePage.urlPattern);
      await expect(checkoutCompletePage.pageTitle).toHaveText(pageTitles.checkoutComplete);
      await expect(checkoutCompletePage.completeHeader).toHaveText(checkoutMessages.orderCompleteHeader);
      await expect(checkoutCompletePage.completeText).toHaveText(checkoutMessages.orderCompleteText);
      await expect(checkoutCompletePage.header.cartBadge).toBeHidden();
    });

    await checkoutCompletePage.backHome();
    await expect(page).toHaveURL(homePage.urlPattern);
    await expect(homePage.pageTitle).toHaveText(pageTitles.inventory);
  });

  test.describe('Com produtos no carrinho', () => {
    const selectedProducts = [products.backpack, products.boltTShirt, products.fleeceJacket];

    test.beforeEach(async ({ authenticatedHomePage: homePage, cartPage }) => {
      for (const product of selectedProducts) {
        await homePage.addToCart(product);
      }
      await homePage.header.openCart();
      await expect(cartPage.cartItems.items).toHaveCount(selectedProducts.length);
    });

    test('Deve calcular corretamente subtotal, taxa e total do pedido', async ({
      cartPage,
      checkoutInformationPage,
      checkoutOverviewPage,
    }) => {
      await allure.severity(allure.Severity.CRITICAL);
      await allure.story('Resumo do pedido');

      const cartPrices = await cartPage.cartItems.getPrices();
      await cartPage.checkout();
      await checkoutInformationPage.submitInformation(TestDataFactory.customer());
      await expect(checkoutOverviewPage.pageTitle).toHaveText(pageTitles.checkoutOverview);

      const expectedSubtotal = roundToCents(cartPrices.reduce((sum, price) => sum + price, 0));
      const subtotal = await checkoutOverviewPage.getSubtotal();
      const tax = await checkoutOverviewPage.getTax();
      const total = await checkoutOverviewPage.getTotal();

      expect(await checkoutOverviewPage.cartItems.getPrices()).toEqual(cartPrices);
      expect(subtotal).toBe(expectedSubtotal);
      expect(tax).toBeGreaterThan(0);
      expect(total).toBe(roundToCents(subtotal + tax));
    });

    test('Deve remover um produto do carrinho antes do checkout', async ({ cartPage }) => {
      await allure.severity(allure.Severity.NORMAL);
      await allure.story('Carrinho');

      await cartPage.removeItem(products.boltTShirt);

      await expect(cartPage.cartItems.items).toHaveCount(selectedProducts.length - 1);
      await expect(cartPage.cartItems.item(products.boltTShirt)).toBeHidden();
      await expect(cartPage.header.cartBadge).toHaveText(String(selectedProducts.length - 1));
    });

    test('Deve voltar ao carrinho ao cancelar o checkout', async ({
      cartPage,
      checkoutInformationPage,
      page,
    }) => {
      await allure.severity(allure.Severity.MINOR);
      await allure.story('Dados do comprador');

      await cartPage.checkout();
      await checkoutInformationPage.cancel();

      await expect(page).toHaveURL(cartPage.urlPattern);
      await expect(cartPage.cartItems.items).toHaveCount(selectedProducts.length);
    });

    const requiredFields: { field: string; customer: Partial<CustomerInfo>; message: string }[] = [
      { field: 'nome', customer: { firstName: '' }, message: checkoutMessages.firstNameRequired },
      { field: 'sobrenome', customer: { lastName: '' }, message: checkoutMessages.lastNameRequired },
      { field: 'CEP', customer: { postalCode: '' }, message: checkoutMessages.postalCodeRequired },
    ];

    for (const { field, customer, message } of requiredFields) {
      test(`Deve exigir o preenchimento do ${field} do comprador`, async ({
        cartPage,
        checkoutInformationPage,
        page,
      }) => {
        await allure.severity(allure.Severity.NORMAL);
        await allure.story('Dados do comprador');

        await cartPage.checkout();
        await checkoutInformationPage.submitInformation(TestDataFactory.customer(customer));

        await expect(checkoutInformationPage.errorMessage).toHaveText(message);
        await expect(page).toHaveURL(checkoutInformationPage.urlPattern);
      });
    }
  });
});
