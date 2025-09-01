// Low-flake visual spot check of the login card/container
import { test, expect } from '../../fixtures/test-fixtures.js';

test('visual: login form', async ({ loginPage, page }) => {
  await loginPage.goto();
  const loginCard = page.locator('div.orangehrm-login-form');
  await expect(loginCard).toBeVisible();
  await expect(loginCard).toHaveScreenshot('login-form.png', {
    mask: [page.locator('.orangehrm-login-branding')]
  });
});
