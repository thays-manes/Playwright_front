import { randomUUID } from 'node:crypto';
import type { UserCredentials } from '../types';

/** Generates disposable data so tests do not depend on fixed values. */
export class TestDataFactory {
  static uniqueSuffix(): string {
    return randomUUID().slice(0, 8);
  }

  static invalidCredentials(): UserCredentials {
    const suffix = TestDataFactory.uniqueSuffix();
    return { username: `invalid_user_${suffix}`, password: `wrong_pass_${suffix}` };
  }
}
