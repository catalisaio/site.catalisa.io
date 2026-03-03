import { test as base, type Page } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_STATE_PATH = path.resolve(__dirname, '..', '.auth-storage.json');

/**
 * Log in via the UI form at /treinamento/login.
 * Fills email/password, submits, and waits for redirect to /treinamento.
 */
async function loginViaUI(page: Page) {
  const email = process.env.E2E_TEST_EMAIL!;
  const password = process.env.E2E_TEST_PASSWORD!;

  await page.goto('/treinamento/login');
  await page.waitForLoadState('networkidle');

  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.locator('button[type="submit"]').click();

  // Wait for redirect to the training catalog
  await page.waitForURL('**/treinamento', { timeout: 15_000 });
}

/**
 * Custom Playwright fixture that provides an authenticated page.
 * Logs in once and reuses storageState for subsequent tests.
 */
export const test = base.extend<{ authedPage: Page }>({
  authedPage: async ({ browser }, use) => {
    // If storage state exists, reuse it
    if (fs.existsSync(STORAGE_STATE_PATH)) {
      const context = await browser.newContext({ storageState: STORAGE_STATE_PATH });
      const page = await context.newPage();

      // Verify the session is still valid
      await page.goto('/treinamento');
      const url = page.url();

      if (!url.includes('/login')) {
        await use(page);
        await context.close();
        return;
      }

      // Session expired — re-login below
      await context.close();
    }

    // Fresh login
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginViaUI(page);

    // Persist storage state for reuse
    await context.storageState({ path: STORAGE_STATE_PATH });

    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
