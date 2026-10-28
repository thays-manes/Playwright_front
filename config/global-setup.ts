import fs from 'node:fs';
import path from 'node:path';

/**
 * Runs once before the whole suite. Clears results from previous runs so the
 * Allure report only shows the current execution (history is kept separately).
 */
export default function globalSetup(): void {
  fs.rmSync(path.resolve(process.cwd(), 'allure-results'), { recursive: true, force: true });
}
