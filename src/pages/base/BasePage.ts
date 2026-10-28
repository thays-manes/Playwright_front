import type { Page } from '@playwright/test';
import { NavigationActions, type Route } from '../../actions/NavigationActions';
import { Logger } from '../../utils/Logger';

/**
 * Behavior shared by every page. Keep it small: anything specific
 * to one page belongs in that page's class.
 */
export abstract class BasePage {
  protected readonly logger: Logger;
  private readonly navigation: NavigationActions;

  /** Route that opens this page, relative to baseURL. */
  protected abstract readonly route: Route;

  constructor(protected readonly page: Page) {
    this.logger = new Logger(this.constructor.name);
    this.navigation = new NavigationActions(page);
  }

  async open(): Promise<void> {
    this.logger.debug(`Abrindo ${this.route}`);
    await this.navigation.goTo(this.route);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  getCurrentUrl(): string {
    return this.page.url();
  }

  /** URL matcher for this page, used with expect(page).toHaveURL(). */
  get urlPattern(): RegExp {
    return NavigationActions.urlPattern(this.route);
  }
}
