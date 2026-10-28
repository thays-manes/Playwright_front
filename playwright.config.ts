import { defineConfig, devices } from '@playwright/test';
import { getEnvironment } from './config/environments';
import { Environment } from './src/utils/Environment';

const environment = getEnvironment();
const isCI = Environment.isCI;

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: Environment.number('TEST_TIMEOUT', 30_000),
  expect: {
    timeout: Environment.number('EXPECT_TIMEOUT', 5_000),
  },
  // Destructive scenarios never run against production.
  grepInvert: environment.isProduction ? /@destructive/ : undefined,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: environment.baseURL,
    testIdAttribute: 'data-test',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: Environment.number('ACTION_TIMEOUT', 10_000),
    navigationTimeout: Environment.number('NAVIGATION_TIMEOUT', 15_000),
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
