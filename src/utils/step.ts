import { test } from '@playwright/test';

type AsyncMethod<This, Args extends unknown[], Return> = (
  this: This,
  ...args: Args
) => Promise<Return>;

/**
 * Wraps a page object method in test.step(), so the Playwright and Allure reports
 * show readable business steps instead of raw clicks.
 * `box: true` makes failures point to the line in the test that called the method.
 *
 * @example
 * @step('Abrir o menu')
 * @step((product: string) => `Adicionar "${product}" ao carrinho`)
 */
export function step<Args extends unknown[]>(name: string | ((...args: Args) => string)) {
  return function <This, Return>(
    target: AsyncMethod<This, Args, Return>,
  ): AsyncMethod<This, Args, Return> {
    return function (this: This, ...args: Args): Promise<Return> {
      const title = typeof name === 'function' ? name(...args) : name;
      return test.step(title, () => target.call(this, ...args), { box: true });
    };
  };
}
