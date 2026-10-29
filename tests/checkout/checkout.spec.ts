import * as allure from 'allure-js-commons';
import { checkoutMessages, pageTitles } from '../../src/data/checkout';
import { products } from '../../src/data/products';
import { hasStandardUser } from '../../src/data/users';
import { expect, test } from '../../src/fixtures/testFixtures';
import type { CustomerInfo } from '../../src/types';
import { roundToCents } from '../../src/utils/currency';
import { TestDataFactory } from '../../src/utils/TestDataFactory';

// Compras criam pedidos, por isso todo o grupo tem a tag @destructive:
// ele nunca roda em produção (veja grepInvert no playwright.config.ts).
test.describe('Checkout', { tag: '@destructive' }, () => {
  // Pula todos os testes se o .env não tiver usuário e senha.
  test.skip(!hasStandardUser(), 'Defina TEST_USERNAME e TEST_PASSWORD no .env');

  // Antes de cada teste: classifica no Allure (Épico "Compras" > Funcionalidade "Checkout").
  test.beforeEach(async () => {
    await allure.epic('Compras');
    await allure.feature('Checkout');
  });

  // Teste de ponta a ponta (E2E): do catálogo até a confirmação do pedido.
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
    // Produtos que vamos comprar.
    const selectedProducts = [products.backpack, products.bikeLight];

    // test.step cria um passo com nome no relatório, agrupando as ações e validações.
    await test.step('Adicionar produtos ao carrinho', async () => {
      for (const product of selectedProducts) {
        await homePage.addToCart(product);
      }
      // O contador do carrinho deve mostrar a quantidade de produtos adicionados.
      await expect(homePage.header.cartBadge).toHaveText(String(selectedProducts.length));
    });

    await test.step('Conferir o carrinho', async () => {
      await homePage.header.openCart();
      await expect(page).toHaveURL(cartPage.urlPattern);
      await expect(cartPage.pageTitle).toHaveText(pageTitles.cart);
      // Os nomes no carrinho devem ser exatamente os produtos escolhidos, na mesma ordem.
      await expect(cartPage.cartItems.names).toHaveText(selectedProducts);
    });

    await test.step('Informar os dados do comprador', async () => {
      await cartPage.checkout();
      await expect(checkoutInformationPage.pageTitle).toHaveText(pageTitles.checkoutInformation);
      // Preenche com um comprador gerado aleatoriamente e clica em Continue.
      await checkoutInformationPage.submitInformation(TestDataFactory.customer());
    });

    await test.step('Conferir o resumo do pedido', async () => {
      await expect(page).toHaveURL(checkoutOverviewPage.urlPattern);
      await expect(checkoutOverviewPage.pageTitle).toHaveText(pageTitles.checkoutOverview);
      await expect(checkoutOverviewPage.cartItems.names).toHaveText(selectedProducts);
      // Pagamento e entrega precisam estar preenchidos.
      await expect(checkoutOverviewPage.paymentInfo).not.toBeEmpty();
      await expect(checkoutOverviewPage.shippingInfo).not.toBeEmpty();
    });

    // Clica em Finish.
    await checkoutOverviewPage.finish();

    await test.step('Validar a confirmação do pedido', async () => {
      await expect(page).toHaveURL(checkoutCompletePage.urlPattern);
      await expect(checkoutCompletePage.pageTitle).toHaveText(pageTitles.checkoutComplete);
      await expect(checkoutCompletePage.completeHeader).toHaveText(checkoutMessages.orderCompleteHeader);
      await expect(checkoutCompletePage.completeText).toHaveText(checkoutMessages.orderCompleteText);
      // Depois da compra o carrinho fica vazio, então o contador some.
      await expect(checkoutCompletePage.header.cartBadge).toBeHidden();
    });

    // Volta para o catálogo e confere que chegou lá.
    await checkoutCompletePage.backHome();
    await expect(page).toHaveURL(homePage.urlPattern);
    await expect(homePage.pageTitle).toHaveText(pageTitles.inventory);
  });

  // Subgrupo: testes que começam com produtos já no carrinho.
  test.describe('Com produtos no carrinho', () => {
    const selectedProducts = [products.backpack, products.boltTShirt, products.fleeceJacket];

    // Antes de cada teste deste subgrupo: faz login, adiciona os 3 produtos e abre o carrinho.
    test.beforeEach(async ({ authenticatedHomePage: homePage, cartPage }) => {
      for (const product of selectedProducts) {
        await homePage.addToCart(product);
      }
      await homePage.header.openCart();
      // Garante que os 3 produtos estão no carrinho antes de começar o teste.
      await expect(cartPage.cartItems.items).toHaveCount(selectedProducts.length);
    });

    test('Deve calcular corretamente subtotal, taxa e total do pedido', async ({
      cartPage,
      checkoutInformationPage,
      checkoutOverviewPage,
    }) => {
      await allure.severity(allure.Severity.CRITICAL);
      await allure.story('Resumo do pedido');

      // Guarda os preços do carrinho para comparar depois.
      const cartPrices = await cartPage.cartItems.getPrices();
      // Vai até o resumo do pedido.
      await cartPage.checkout();
      await checkoutInformationPage.submitInformation(TestDataFactory.customer());
      await expect(checkoutOverviewPage.pageTitle).toHaveText(pageTitles.checkoutOverview);

      // Subtotal esperado = soma dos preços do carrinho (reduce soma todos os itens da lista).
      const expectedSubtotal = roundToCents(cartPrices.reduce((sum, price) => sum + price, 0));
      // Valores exibidos na tela.
      const subtotal = await checkoutOverviewPage.getSubtotal();
      const tax = await checkoutOverviewPage.getTax();
      const total = await checkoutOverviewPage.getTotal();

      // Os preços no resumo são os mesmos do carrinho.
      expect(await checkoutOverviewPage.cartItems.getPrices()).toEqual(cartPrices);
      // O subtotal é a soma dos produtos.
      expect(subtotal).toBe(expectedSubtotal);
      // Existe uma taxa maior que zero.
      expect(tax).toBeGreaterThan(0);
      // Total = subtotal + taxa.
      expect(total).toBe(roundToCents(subtotal + tax));
    });

    test('Deve remover um produto do carrinho antes do checkout', async ({ cartPage }) => {
      await allure.severity(allure.Severity.NORMAL);
      await allure.story('Carrinho');

      // Ação: remove a camiseta.
      await cartPage.removeItem(products.boltTShirt);

      // Validações: sobram 2 itens, a camiseta sumiu e o contador mostra 2.
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

      // Ação: entra no checkout e clica em Cancel.
      await cartPage.checkout();
      await checkoutInformationPage.cancel();

      // Validações: voltou para o carrinho e os produtos continuam lá.
      await expect(page).toHaveURL(cartPage.urlPattern);
      await expect(cartPage.cartItems.items).toHaveCount(selectedProducts.length);
    });

    // Testes de campo obrigatório: em vez de escrever 3 testes quase iguais,
    // montamos uma tabela com os dados de cada caso e geramos um teste para cada linha.
    // field: nome do campo | customer: o campo que fica vazio | message: erro esperado
    const requiredFields: { field: string; customer: Partial<CustomerInfo>; message: string }[] = [
      { field: 'nome', customer: { firstName: '' }, message: checkoutMessages.firstNameRequired },
      { field: 'sobrenome', customer: { lastName: '' }, message: checkoutMessages.lastNameRequired },
      { field: 'CEP', customer: { postalCode: '' }, message: checkoutMessages.postalCodeRequired },
    ];

    // Para cada linha da tabela, cria um teste (ex.: "Deve exigir o preenchimento do CEP do comprador").
    for (const { field, customer, message } of requiredFields) {
      test(`Deve exigir o preenchimento do ${field} do comprador`, async ({
        cartPage,
        checkoutInformationPage,
        page,
      }) => {
        await allure.severity(allure.Severity.NORMAL);
        await allure.story('Dados do comprador');

        // Ação: preenche o formulário deixando um campo vazio e clica em Continue.
        await cartPage.checkout();
        await checkoutInformationPage.submitInformation(TestDataFactory.customer(customer));

        // Validações: aparece o erro do campo e a página não avança.
        await expect(checkoutInformationPage.errorMessage).toHaveText(message);
        await expect(page).toHaveURL(checkoutInformationPage.urlPattern);
      });
    }
  });
});
