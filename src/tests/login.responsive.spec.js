// Mobile responsiveness checks for OrangeHRM login
import { test, expect, devices } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage.js';

/** Helper: find a likely "hamburger/toggle" button if present */
async function findHamburger(page) {
  const candidates = [
    page.getByRole('button', { name: /menu|toggle navigation|open (nav|menu)|hamburger/i }),
    page.locator('[data-testid*="hamburger" i]'),
    page.locator('button:has(svg[aria-label*="menu" i])'),
    page.locator('.hamburger, .menu-toggle, .oxd-topbar-header .bi-list').locator('xpath=ancestor-or-self::button')
  ];
  for (const c of candidates) {
    try {
      if (await c.first().isVisible()) return c.first();
    } catch { /* ignore */ }
  }
  return null;
}

/* -------- Portrait (iPhone 14) -------- */
test.describe('Mobile (portrait)', () => {
  test.use({ viewport: devices['iPhone 14'].viewport });

  test('login form usable, no horizontal overflow, mobile cue if present', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    // No horizontal scrollbars (layout fits viewport)
    const hasHScroll = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHScroll).toBe(false);

    // Tap target size (Apple HIG: >= 44x44 CSS px)
    const box = await loginPage.loginButton.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);

    // Mobile-only UI cue (e.g., hamburger/toggle) — assert only if it exists
    const hamburger = await findHamburger(page);
    if (hamburger) {
      await expect(hamburger).toBeVisible();
    }
  });
});

/* -------- Landscape (iPhone 14 landscape) -------- */
test.describe('Mobile (landscape)', () => {
  // Prefer the built-in device profile if available
  const landscapeProfile = devices['iPhone 14 landscape']?.viewport
    ? devices['iPhone 14 landscape'].viewport
    : (() => {
        const p = devices['iPhone 14'].viewport;
        return { width: p.height, height: p.width, deviceScaleFactor: p.deviceScaleFactor, isMobile: true, hasTouch: true };
      })();

  test.use({ viewport: landscapeProfile });

  test('login form usable in landscape, no horizontal overflow', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    const hasHScroll = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHScroll).toBe(false);

    const box = await loginPage.loginButton.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);

    const hamburger = await findHamburger(page);
    if (hamburger) {
      await expect(hamburger).toBeVisible();
    }
  });
});
