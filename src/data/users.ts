import { Environment } from '../utils/Environment';
import type { UserCredentials } from '../types';

/**
 * Credentials always come from environment variables (.env locally,
 * secrets in CI). Nothing sensitive is versioned.
 */
export const users = {
  standard: (): UserCredentials => ({
    username: Environment.require('TEST_USERNAME'),
    password: Environment.require('TEST_PASSWORD'),
  }),
  lockedOut: (): UserCredentials => ({
    username: Environment.require('TEST_LOCKED_USERNAME'),
    password: Environment.require('TEST_PASSWORD'),
  }),
};

export const hasStandardUser = (): boolean => Environment.has('TEST_USERNAME', 'TEST_PASSWORD');
export const hasLockedOutUser = (): boolean =>
  Environment.has('TEST_LOCKED_USERNAME', 'TEST_PASSWORD');

/** Messages displayed by the application under test. */
export const loginMessages = {
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  invalidCredentials:
    'Epic sadface: Username and password do not match any user in this service',
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  protectedRoute: (route: string) =>
    `Epic sadface: You can only access '${route}' when you are logged in.`,
};
