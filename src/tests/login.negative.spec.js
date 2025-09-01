// Negative credential checks and resiliency
import { test, expect } from '../../fixtures/test-fixtures.js';

const USER = process.env.TEST_USERNAME;

test.describe('Login — Negative', () => {
  test('wrong password shows inline error and stays on /login', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.usernameInput.fill(USER || 'Admin');
    await loginPage.passwordInput.fill('totally-wrong');
    await loginPage.loginButton.click();

    await expect(page).toHaveURL(/auth\/login/);
    await expect(page.locator('.oxd-text.oxd-text--p.oxd-alert-content-text')).toBeVisible();
    await expect(page.getByText(/invalid|incorrect|failed|unauthor/i)).toBeVisible();
  });

  test('empty submit shows required field messages', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.submitEmpty();
    await loginPage.expectRequiredMessages(2);
  });

  test('leading/trailing spaces are trimmed or rejected', async ({ loginPage, page }) => {
    const user = (USER || 'Admin');
    await loginPage.goto();
    await loginPage.usernameInput.fill(`  ${user}  `);
    await loginPage.passwordInput.fill('  wrong  ');
    await loginPage.loginButton.click();

    await expect(page).toHaveURL(/auth\/login/);
    await expect(page.locator('.oxd-text.oxd-text--p.oxd-alert-content-text')).toBeVisible();
  });

  test('basic injection strings are rejected (UI-level)', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.usernameInput.fill("' OR '1'='1");
    await loginPage.passwordInput.fill("' OR '1'='1");
    await loginPage.loginButton.click();

    await expect(page).toHaveURL(/auth\/login/);
    await expect(page.locator('.oxd-text.oxd-text--p.oxd-alert-content-text')).toBeVisible();
  });
});
