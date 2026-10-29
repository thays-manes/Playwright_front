// @ts-check
// ESLint: ferramenta que analisa o código e aponta erros e más práticas ANTES de rodar os testes.
// Rode com "npm run lint".
const eslint = require('@eslint/js'); // regras básicas de JavaScript
const tseslint = require('typescript-eslint'); // regras para TypeScript
const playwright = require('eslint-plugin-playwright'); // regras específicas para testes Playwright

module.exports = tseslint.config(
  {
    // Pastas que o ESLint não deve analisar (dependências e relatórios gerados).
    ignores: [
      'node_modules/',
      'test-results/',
      'playwright-report/',
      'blob-report/',
      'allure-results/',
      'allure-report/',
      'allure-history/',
    ],
  },
  // Regras recomendadas de JavaScript.
  eslint.configs.recommended,
  {
    // Regras para todos os arquivos TypeScript.
    files: ['**/*.ts'],
    // Regras recomendadas de TypeScript que usam as informações de tipo do projeto.
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true, // usa o tsconfig.json para entender os tipos
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Esquecer o "await" em uma ação do Playwright é a causa mais comum de testes instáveis.
      // Estas duas regras transformam isso em erro.
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      // Avisa quando uma função não declara o tipo do retorno (ex.: ": Promise<void>").
      '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
    },
  },
  {
    // Regras extras só para os arquivos de teste.
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Proíbe esperas fixas (page.waitForTimeout), que deixam o teste lento e instável.
      'playwright/no-wait-for-timeout': 'error',
      // Proíbe pular testes, exceto quando há uma condição (ex.: test.skip(!temUsuario, ...)).
      'playwright/no-skipped-test': ['error', { allowConditional: true }],
    },
  },
  {
    // Este próprio arquivo usa o formato CommonJS (require/module.exports).
    files: ['eslint.config.js'],
    languageOptions: { sourceType: 'commonjs', globals: { require: 'readonly', module: 'writable', __dirname: 'readonly' } },
  },
);
