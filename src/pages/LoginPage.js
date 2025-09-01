// POM for OrangeHRM Login Page
import { expect } from '@playwright/test';

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Core elements
    this.usernameInput = page.getByPlaceholder('Username'); // inputs have placeholders 'Username', 'Password'
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.locator("button[type='submit']");

    // Validation / errors
    this.invalidCredentials = page.locator('.oxd-text.oxd-text--p.oxd-alert-content-text'); // top error banner
    this.requiredMessages = page.locator('.oxd-text.oxd-text--span.oxd-input-field-error-message.oxd-input-group__message'); // per-field "Required"

    // Helpful links
    this.forgotPasswordLink = page.locator('.oxd-text.oxd-text--p.orangehrm-login-forgot-header');
  }

  async goto() {
    await this.page.goto('/web/index.php/auth/login');
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async loginAs(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async submitEmpty() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
    await this.loginButton.click();
  }

  async expectOnLoginUrl() {
    await expect(this.page).toHaveURL(/\/auth\/login/);
  }

  async expectLoggedIn() {
    // After successful login, OrangeHRM typically routes to /dashboard
    await expect(this.page).toHaveURL(/\/dashboard/);
    // sanity check for an element on dashboard (menu)
    await expect(this.page.locator('.oxd-icon.bi-question-lg')).toBeVisible();
  }

  async expectInvalidCredsError() {
    await expect(this.invalidCredentials).toBeVisible();
    await expect(this.invalidCredentials).toContainText(/Invalid credentials/i);
  }

  async expectRequiredMessages(count = 2) {
    await expect(this.requiredMessages).toHaveCount(count);
    await expect(this.requiredMessages.first()).toContainText(/Required/i);
  }

  async openForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async expectForgotPasswordPage() {
    await expect(this.page).toHaveURL(/requestPasswordResetCode/);
    await expect(this.page.getByRole('heading', { name: /Reset Password|Forgot your password/i })).toBeVisible();
  }
}
