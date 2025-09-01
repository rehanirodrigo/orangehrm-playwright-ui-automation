// Field presence, placeholder, max length, and error-clearing behavior
import { test, expect } from '../../fixtures/test-fixtures.js';

test.describe('Login — Validation & UX', () => {
  test('placeholders and button presence', async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.usernameInput).toHaveAttribute('placeholder', /username/i);
    await expect(loginPage.passwordInput).toHaveAttribute('placeholder', /password/i);
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('errors clear after correcting input', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.submitEmpty();
    await loginPage.expectRequiredMessages(2);

    await loginPage.usernameInput.fill('Admin');
    await loginPage.passwordInput.fill('admin123');
    // expect previous per-field error messages to disappear
    await expect(loginPage.requiredMessages).toHaveCount(0);
  });

  test('password visibility toggle (eye icon) works (if present)', async ({ loginPage, page }) => {
    await loginPage.goto();
    // Try to find a button inside the password field group
    const toggle = loginPage.passwordInput.locator('xpath=ancestor::div[contains(@class,"oxd-input-group")]//button');
    const present = await toggle.isVisible().catch(() => false);
    test.skip(!present, 'Password visibility toggle not present in this build');

    await expect(loginPage.passwordInput).toHaveAttribute('type', /password/i);
    await toggle.click();
    await expect(loginPage.passwordInput).toHaveAttribute('type', /text/i);
    await toggle.click();
    await expect(loginPage.passwordInput).toHaveAttribute('type', /password/i);
  });
});
