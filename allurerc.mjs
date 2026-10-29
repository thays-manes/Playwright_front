// Configuração do Allure Report 3 (o relatório visual com gráficos).
// É lida pelos comandos "allure generate" e "allure open".
import { defineConfig } from 'allure';

export default defineConfig({
  // Nome do relatório.
  name: 'Playwright - Sauce Demo',
  // Pasta onde o relatório HTML é gerado.
  output: './allure-report',
  // Arquivo que guarda o resultado das execuções anteriores, usado nos gráficos de tendência.
  historyPath: './allure-history/history.jsonl',
  // Plugins = "modelos" de relatório que serão gerados.
  plugins: {
    // awesome: relatório principal com cenários, passos, prints, vídeos e traces.
    awesome: {
      options: {
        reportName: 'Playwright - Sauce Demo',
        // Agrupa os testes na árvore por: pasta/arquivo → describe → sub-describe.
        groupBy: ['parentSuite', 'suite', 'subSuite'],
      },
    },
    // dashboard: gráficos (percentual de sucesso/falha, tendência, duração e outros).
    dashboard: {
      options: {
        reportName: 'Playwright - Sauce Demo (Dashboard)',
      },
    },
  },
});
