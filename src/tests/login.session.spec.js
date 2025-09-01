// Session behavior: cookie presence, logout clears, secure pages require auth
import { test, expect } from '../../fixtures/test-fixtures.js';

const USER = process.env.TEST_USERNAME;
const PASS = process.env.TEST_PASSWORD;

test.describe('Login — Session & Logout', () => {
  test.skip(!USER || !PASS, 'Set TEST_USERNAME and TEST_PASSWORD in .env');

  test('login sets session; logout clears; deep link redirects after logout', async ({ loginPage, page, context }) => {
    await loginPage.goto();
    await loginPage.loginAs(USER, PASS);

    const cookies = await context.cookies();
    expect(cookies.length).toBeGreaterThan(0);

    const userMenu = page.locator('.oxd-userdropdown');
    await userMenu.click();
    await page.getByRole('menuitem', { name: /logout/i }).click();
    await expect(page).toHaveURL(/auth\/login/);

    await page.goto('/web/index.php/dashboard/index');
    await expect(page).toHaveURL(/auth\/login/);
  });
});
