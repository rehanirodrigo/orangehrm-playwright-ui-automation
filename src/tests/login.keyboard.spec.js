// Keyboard-only flows: tab order and Enter-to-submit
import { test, expect } from '../../fixtures/test-fixtures.js';

const USER = process.env.TEST_USERNAME;
const PASS = process.env.TEST_PASSWORD;

test.describe('Login — Keyboard & Focus', () => {
  test('tab order: Username → Password → Login button', async ({ loginPage, page }) => {
    await loginPage.goto();

    // Ensure we START on Username (don’t assume page’s default focus)
    await loginPage.usernameInput.focus();
    await expect(loginPage.usernameInput).toBeFocused();

    // Tab to Password
    await page.keyboard.press('Tab');
    await expect(loginPage.passwordInput).toBeFocused();

    // Tab to Login button
    await page.keyboard.press('Tab');
    await expect(loginPage.loginButton).toBeFocused();
  });

  test.skip(!USER || !PASS, 'Set TEST_USERNAME and TEST_PASSWORD in .env');
  test('pressing Enter in password submits the form', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.usernameInput.fill(USER);
    await loginPage.passwordInput.fill(PASS);

    // Put focus in password and press Enter to submit
    await loginPage.passwordInput.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/web\/index\.php\/dashboard\/index$/);
  });
});
