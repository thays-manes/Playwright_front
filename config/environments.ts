import { Environment } from '../src/utils/Environment';
import type { EnvironmentConfig, EnvironmentName } from '../src/types';

/**
 * Each environment reads its URL from its own variable, so switching
 * environments only requires changing TEST_ENV — never the tests.
 * "demo" points to Sauce Demo, a public application built for test practice.
 */
const environments: Record<EnvironmentName, () => EnvironmentConfig> = {
  demo: () => ({
    name: 'demo',
    baseURL: Environment.get('BASE_URL', 'https://www.saucedemo.com')!,
    isProduction: false,
  }),
  dev: () => ({ name: 'dev', baseURL: Environment.require('BASE_URL_DEV'), isProduction: false }),
  hml: () => ({ name: 'hml', baseURL: Environment.require('BASE_URL_HML'), isProduction: false }),
  prod: () => ({ name: 'prod', baseURL: Environment.require('BASE_URL_PROD'), isProduction: true }),
};

export function getEnvironment(): EnvironmentConfig {
  const name = Environment.get('TEST_ENV', 'demo') as EnvironmentName;
  const factory = environments[name];
  if (!factory) {
    throw new Error(
      `TEST_ENV inválido: "${name}". Valores aceitos: ${Object.keys(environments).join(', ')}.`,
    );
  }
  return factory();
}
