/*Tests include
✅ Happy path — logs in with TEST_USERNAME/TEST_PASSWORD from .env.
*/

import { test, expect } from '../../fixtures/test-fixtures.js';

const USER = process.env.TEST_USERNAME;
const PASS = process.env.TEST_PASSWORD;

// Skip the whole suite if creds are not configured
const credsMissing = !USER || !PASS;

test.describe('Login — Happy Path', () => {
test.skip(credsMissing, 'Set TEST_USERNAME and TEST_PASSWORD in .env to run login tests');

  test('login lands on dashboard', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.loginAs(USER, PASS);
    await expect(page).toHaveURL(/\/dashboard\/index$/);
  });

  test('deep link redirects through login then back (dashboard)', async ({ loginPage, page }) => {
    // Start on a secure page; should bounce to login
    await page.goto('/web/index.php/dashboard/index');
    await expect(page).toHaveURL(/\/auth\/login/);
    await loginPage.loginAs(USER, PASS);
    await expect(page).toHaveURL(/\/dashboard\/index$/);
  });

});
