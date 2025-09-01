// Forgot password navigation & simple validation
import { test, expect } from '../../fixtures/test-fixtures.js';

test.describe('Login — Forgot Password', () => {
  test('link navigates to reset page', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.openForgotPassword();
    await loginPage.expectForgotPasswordPage();
  });

  test('reset page blocks empty submit (if form allows)', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.openForgotPassword();
    await loginPage.expectForgotPasswordPage();

    // If a submit exists, it should require username
    const submit = page.getByRole('button', { name: /reset|request|submit/i });
    const hasSubmit = await submit.isVisible().catch(() => false);
    test.skip(!hasSubmit, 'Reset submit not present');

    await submit.click();
    await expect(page.getByText(/required/i)).toBeVisible();
  });
});
