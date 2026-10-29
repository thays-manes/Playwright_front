import { Environment } from '../src/utils/Environment';
import type { EnvironmentConfig, EnvironmentName } from '../src/types';

/**
 * Lista de ambientes onde os testes podem rodar.
 * Cada ambiente lê a sua URL de uma variável própria (.env), então para trocar de ambiente
 * basta mudar a variável TEST_ENV — os testes não mudam.
 * "demo" aponta para o Sauce Demo, um site público feito para praticar testes.
 */
const environments: Record<EnvironmentName, () => EnvironmentConfig> = {
  // demo: usa BASE_URL se existir; se não, usa o Sauce Demo.
  // O "!" no final diz ao TypeScript que o valor nunca será vazio (porque tem um valor padrão).
  demo: () => ({
    name: 'demo',
    baseURL: Environment.get('BASE_URL', 'https://www.saucedemo.com')!,
    isProduction: false,
  }),
  // dev, hml e prod: a URL é obrigatória. Se a variável não existir, o teste para com uma mensagem clara.
  dev: () => ({ name: 'dev', baseURL: Environment.require('BASE_URL_DEV'), isProduction: false }),
  hml: () => ({ name: 'hml', baseURL: Environment.require('BASE_URL_HML'), isProduction: false }),
  // isProduction: true faz o playwright.config.ts pular os testes @destructive.
  prod: () => ({ name: 'prod', baseURL: Environment.require('BASE_URL_PROD'), isProduction: true }),
};

/** Retorna a configuração do ambiente escolhido em TEST_ENV (padrão: "demo"). */
export function getEnvironment(): EnvironmentConfig {
  // Lê o nome do ambiente da variável TEST_ENV.
  const name = Environment.get('TEST_ENV', 'demo') as EnvironmentName;
  // Procura esse nome na lista de ambientes acima.
  const factory = environments[name];
  // Se o nome não existir na lista (ex.: TEST_ENV=teste), avisa quais valores são aceitos.
  if (!factory) {
    throw new Error(
      `TEST_ENV inválido: "${name}". Valores aceitos: ${Object.keys(environments).join(', ')}.`,
    );
  }
  // Executa a função do ambiente e devolve { name, baseURL, isProduction }.
  return factory();
}
