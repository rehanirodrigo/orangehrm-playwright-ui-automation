// Data-driven tests: multiple invalid credential combos
import { test, expect } from '../../fixtures/test-fixtures.js';

const cases = [
  { name: 'blank username', u: '', p: 'admin123', error: /required|invalid/i },
  { name: 'blank password', u: 'Admin', p: '', error: /required|invalid/i },
  { name: 'wrong user',     u: 'NotAUser', p: 'admin123', error: /invalid/i },
  { name: 'case mismatch',  u: 'admin', p: 'ADMIN123', error: /invalid/i },
];

for (const c of cases) {
  test(`DDT: ${c.name}`, async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.usernameInput.fill(c.u);
    await loginPage.passwordInput.fill(c.p);
    await loginPage.loginButton.click();

    await expect(page).toHaveURL(/auth\/login/);
    await expect(page.getByText(c.error)).toBeVisible();

    try {
        await expect(page.locator('.oxd-text.oxd-text--span.oxd-input-field-error-message.oxd-input-group__message')).toBeVisible({ timeout: 2000 });
    } catch {
        await expect(page.locator('.oxd-text.oxd-text--p.oxd-alert-content-text')).toBeVisible({ timeout: 2000 });
    }

  });
}
