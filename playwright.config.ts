// Arquivo principal de configuração do Playwright.
// Aqui definimos: onde estão os testes, em qual site eles rodam, quais navegadores usar,
// quanto tempo esperar, quais relatórios gerar e o que guardar quando um teste falha.
import os from 'node:os'; // módulo do Node para ler informações do sistema operacional
import { defineConfig, devices } from '@playwright/test';
import { getEnvironment } from './config/environments';
import { Environment } from './src/utils/Environment';

// Descobre em qual ambiente vamos rodar (demo, dev, hml ou prod) a partir da variável TEST_ENV.
const environment = getEnvironment();
// true quando os testes rodam na esteira de CI (GitHub Actions), false na máquina local.
const isCI = Environment.isCI;

export default defineConfig({
  // Pasta onde ficam os arquivos de teste (*.spec.ts).
  testDir: './tests',
  // Pasta onde o Playwright salva prints, vídeos e traces de cada execução.
  outputDir: './test-results',
  // Permite rodar os testes de um mesmo arquivo em paralelo (mais rápido).
  fullyParallel: true,
  // Na CI, falha a execução se alguém esquecer um "test.only" no código.
  forbidOnly: isCI,
  // Na CI, tenta de novo até 2 vezes um teste que falhou (instabilidade de rede, etc.). Local: nenhuma vez.
  retries: isCI ? 2 : 0,
  // Na CI usa 2 processos em paralelo; localmente o Playwright decide conforme a máquina.
  workers: isCI ? 2 : undefined,
  // Tempo máximo de cada teste. Padrão 30 segundos (pode mudar com a variável TEST_TIMEOUT).
  timeout: Environment.number('TEST_TIMEOUT', 30_000),
  expect: {
    // Tempo máximo que cada "expect" espera a condição ficar verdadeira. Padrão 5 segundos.
    timeout: Environment.number('EXPECT_TIMEOUT', 5_000),
  },
  // Testes com a tag @destructive (que criam pedidos, mexem no carrinho...) nunca rodam em produção.
  // grepInvert = "ignorar os testes que tenham este texto no nome/tag".
  grepInvert: environment.isProduction ? /@destructive/ : undefined,
  // Arquivo executado UMA vez antes de todos os testes (limpa resultados antigos do Allure).
  globalSetup: './config/global-setup.ts',
  // Relatórios gerados ao final da execução.
  reporter: [
    // list: mostra o resultado de cada teste no terminal.
    ['list'],
    // html: relatório do Playwright na pasta playwright-report (abrir com "npx playwright show-report").
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    [
      // allure-playwright: gera os dados do relatório Allure (com gráficos) na pasta allure-results.
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true, // mostra os passos detalhados (cliques, preenchimentos) no relatório
        suiteTitle: true, // usa o nome do arquivo/describe para agrupar os testes
        // Informações que aparecem na seção "Environment" do Allure.
        environmentInfo: {
          Ambiente: environment.name,
          'Base URL': environment.baseURL,
          'Node.js': process.version,
          'Sistema operacional': `${os.type()} ${os.release()}`,
        },
      },
    ],
  ],
  // Configurações usadas por todos os testes.
  use: {
    // URL base do site. Nos testes usamos só o caminho, ex.: page.goto('/cart.html').
    baseURL: environment.baseURL,
    // Faz o getByTestId() procurar pelo atributo "data-test" (o padrão do Playwright é "data-testid").
    testIdAttribute: 'data-test',
    // Tira um print ao final de todo teste (passando ou falhando) para anexar nos relatórios.
    screenshot: 'on',
    // Grava vídeo, mas só guarda quando o teste falha.
    video: 'retain-on-failure',
    // Trace = "gravação" passo a passo do teste para investigar falhas. Só guarda quando falha.
    trace: 'retain-on-failure',
    // Tempo máximo de cada ação (clicar, preencher...). Padrão 10 segundos.
    actionTimeout: Environment.number('ACTION_TIMEOUT', 10_000),
    // Tempo máximo para uma página carregar. Padrão 15 segundos.
    navigationTimeout: Environment.number('NAVIGATION_TIMEOUT', 15_000),
  },
  // Navegadores onde os testes rodam. Cada teste é executado uma vez em cada um.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }, // Google Chrome
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } }, // Mozilla Firefox
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }, // Safari (motor do navegador da Apple)
  ],
});
