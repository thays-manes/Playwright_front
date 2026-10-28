import { defineConfig } from 'allure';

export default defineConfig({
  name: 'Playwright - Sauce Demo',
  output: './allure-report',
  // Keeps previous runs to build the trend charts.
  historyPath: './allure-history/history.jsonl',
  plugins: {
    // Main report: scenarios, steps, screenshots, videos and traces.
    awesome: {
      options: {
        reportName: 'Playwright - Sauce Demo',
        groupBy: ['parentSuite', 'suite', 'subSuite'],
      },
    },
    // Charts: pass/fail percentage, status trend, duration and more.
    dashboard: {
      options: {
        reportName: 'Playwright - Sauce Demo (Dashboard)',
      },
    },
  },
});
