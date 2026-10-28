import type { Page } from '@playwright/test';

/** Application routes, relative to baseURL. Single place to update when URLs change. */
export const Routes = {
  login: '/',
  inventory: '/inventory.html',
  cart: '/cart.html',
  checkoutInformation: '/checkout-step-one.html',
  checkoutOverview: '/checkout-step-two.html',
  checkoutComplete: '/checkout-complete.html',
} as const;

export type Route = (typeof Routes)[keyof typeof Routes];

/** Cross-page navigation helpers that do not belong to any single page object. */
export class NavigationActions {
  constructor(private readonly page: Page) {}

  async goTo(route: Route): Promise<void> {
    await this.page.goto(route);
  }

  /** Resolves a route against the configured baseURL, for URL assertions in tests. */
  static urlPattern(route: Route): RegExp {
    const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`${escaped}$`);
  }
}
