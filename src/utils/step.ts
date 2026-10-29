import { test } from '@playwright/test';

// Tipo que representa um método assíncrono (que retorna uma Promise) de uma classe.
// Usado apenas para o TypeScript entender o decorator abaixo.
type AsyncMethod<This, Args extends unknown[], Return> = (
  this: This,
  ...args: Args
) => Promise<Return>;

/**
 * Decorator @step: "embrulha" um método do Page Object em um test.step().
 * Resultado: nos relatórios do Playwright e do Allure aparecem passos legíveis
 * (ex.: "Adicionar "Sauce Labs Backpack" ao carrinho") em vez de cliques soltos.
 * `box: true` faz o erro apontar para a linha do TESTE que chamou o método, e não para dentro da página.
 *
 * Pode receber um texto fixo ou uma função que monta o texto com os parâmetros do método:
 * @example
 * @step('Abrir o menu')
 * @step((product: string) => `Adicionar "${product}" ao carrinho`)
 */
export function step<Args extends unknown[]>(name: string | ((...args: Args) => string)) {
  // Recebe o método original (target)...
  return function <This, Return>(
    target: AsyncMethod<This, Args, Return>,
  ): AsyncMethod<This, Args, Return> {
    // ...e devolve um método novo que faz a mesma coisa, só que dentro de um test.step.
    return function (this: This, ...args: Args): Promise<Return> {
      // Se "name" for uma função, monta o título usando os parâmetros recebidos.
      const title = typeof name === 'function' ? name(...args) : name;
      // Executa o método original dentro do passo.
      return test.step(title, () => target.call(this, ...args), { box: true });
    };
  };
}
