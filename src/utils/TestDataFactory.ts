import { randomInt, randomUUID } from 'node:crypto';
import type { CustomerInfo, UserCredentials } from '../types';

/** Generates disposable data so tests do not depend on fixed values. */
export class TestDataFactory {
  static uniqueSuffix(): string {
    return randomUUID().slice(0, 8);
  }

  static invalidCredentials(): UserCredentials {
    const suffix = TestDataFactory.uniqueSuffix();
    return { username: `invalid_user_${suffix}`, password: `wrong_pass_${suffix}` };
  }

  static customer(overrides: Partial<CustomerInfo> = {}): CustomerInfo {
    const suffix = TestDataFactory.uniqueSuffix();
    return {
      firstName: `Cliente ${suffix}`,
      lastName: 'Teste',
      postalCode: String(randomInt(10_000_000, 99_999_999)),
      ...overrides,
    };
  }
}
