# Playwright UI Automation Suite — OrangeHRM (JavaScript, POM)

A comprehensive **UI-only** automation suite built with **Playwright** and **JavaScript (ESM)**.  
It targets the **OrangeHRM demo** application.
- ✅ Happy-path and negative **login** flows
- 🧪 **Validation/UX** and **data-driven** tests
- ⌨️ **Keyboard/focus** & ♿ **a11y** smoke
- 🔐 **Session security** (logout, deep-link redirects)
- 📱 **Responsive** checks (mobile emulation)
- 🖼️ **Visual** spot checks (low-flake screenshots)
- 🌐 Cross-browser (Chromium/Firefox/WebKit), mobile configs
- 🧰 **POM architecture**, traces, videos, HTML report, CI-ready

> This repo is intentionally focused on **UI coverage** to demonstrate breadth of Playwright skills without backend access.

---

## Tech stack

- **Playwright** (`@playwright/test`)
- **JavaScript (ESM)`**
- **Page Object Model (POM)`**
- HTML report, **trace/video on failure**
- Optional **GitHub Actions** workflow

---

## Project structure


```
src/
  pages/
    LoginPage.js                # OrangeHRM Login POM
  tests/
      login.happypath.spec.js
      login.negative.spec.js
      login.validation.spec.js
      login.keyboard.spec.js
      login.forgot-password.spec.js
      login.session.spec.js
      login.responsive.spec.js
      login.visual.spec.js
      login.ddt.spec.js
fixtures/
  test-fixtures.js              # exposes { test, expect, loginPage, ... }
.github/
  workflows/ci.yml              # (optional) CI example
playwright.config.js
playwright.mobile.js
.env (local)
```

---

## Environment

Create `.env` (copy from `.env.example` if present):

```dotenv
BASE_URL=https://opensource-demo.orangehrmlive.com
TEST_USERNAME=Admin
TEST_PASSWORD=admin123
# Optional: enable HTML5 validation test
STRICT_CLIENT_VALIDATION=0
```

---

## Install & run

```bash
# install
npm ci

# run all tests (default projects from playwright.config.js)
npx playwright test

# run just the OrangeHRM login pack
npx playwright test src/tests/orangehrm

# run a single file
npx playwright test src/tests/orangehrm/login.happy.spec.js

# grep by title/keyword
npx playwright test -g "Negative|Session|visual"

# open the last HTML report
npx playwright show-report
```

### Cross-browser & mobile

```bash
# run on Chromium + Firefox + (optional) WebKit
npx playwright test --project=chromium,firefox,webkit

# mobile emulation (uses playwright.mobile.js)
npx playwright test -c playwright.mobile.js src/tests/orangehrm/login.responsive.spec.js
```

### Debugging

```bash
# UI mode
npx playwright test --ui

# headed with inspector
PWDEBUG=1 npx playwright test src/tests/orangehrm/login.negative.spec.js --project=chromium
```

---

## What’s covered (by file)

| File | Focus | Why it matters |
|---|---|---|
| `login.happypath.spec.js` | Valid creds → dashboard; deep-link → login → back | Core path confidence; post-login routing |
| `login.negative.spec.js` | Wrong creds, empty submit, trimming, simple injection | Guardrails; error rendering |
| `login.validation.spec.js` | Placeholders, error clear on fix, (optional) password eye toggle | UX polish & form behavior |
| `login.keyboard.spec.js` | Tab order; Enter to submit | Accessibility/keyboard support |
| `login.forgot-password.spec.js` | Forgot-password navigation & basic checks | Recovery flow sanity |
| `login.session.spec.js` | Cookie presence, logout clears, deep-link redirects when logged out | Session security |
| `login.responsive.spec.js` | Mobile viewport usability; no horizontal overflow | Mobile readiness |
| `login.visual.spec.js` | Low-flake screenshot of login card | Quick regression signal |
| `login.ddt.spec.js` | Data-driven invalid combos | Coverage breadth & maintainability |

---

## Page Object Model (POM)

**`src/pages/LoginPage.js`** encapsulates:
- stable locators (placeholders, roles, and minimal CSS),
- `goto`, `loginAs`, `submitEmpty`,
- assertions/utilities (`expectInvalidCredsError`, `expectRequiredMessages`, `openForgotPassword`, etc.).

This keeps tests **readable**, **DRY**, and **maintainable**. If selectors change, update in one place.

---

## Reports & artifacts

- **HTML report**: `playwright-report/`
- **Traces**: enabled on retry/failure → open with `npx playwright show-trace trace.zip`
- **Screenshots/Videos**: retained on failure (see `playwright.config.js`)

---

## CI (GitHub Actions example)

```yaml
name: Playwright UI Tests

on:
  push:
    branches: [ main ]
  pull_request:

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - name: Run tests
        env:
          BASE_URL: https://opensource-demo.orangehrmlive.com
          TEST_USERNAME: ${{ secrets.TEST_USERNAME }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
        run: npx playwright test --reporter=html
      - name: Upload HTML report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
```

---

## Troubleshooting

- **“No tests found”**  
  Ensure the file path matches your `testDir` in `playwright.config.js` (`tests/` vs `src/tests/`).  
  List titles with `npx playwright test --list`.

- **PowerShell regex quirks**  
  When grepping with `$` or `*`, use **single quotes**:  
  `npx playwright test -g 'Valid\s+Login$'`

- **Login still on /auth/login**  
  Double-check `.env` creds and `BASE_URL`. The demo sometimes throttles; traces help.

---

## Why this suite is useful for interviews

- Shows **breadth** (not just happy paths).
- Demonstrates **architecture** (POM, fixtures, components).
- Proves **stability** (semantic locators, auto-waits, minimal sleeps).
- Ready for **CI/CD** with actionable artifacts.

---

## Notes

- Built against the public **OrangeHRM demo**; minor UI tweaks may occur. Favor role/label selectors to reduce flake.
- The suite is **UI-only** by design; no backend/test-data hooks required.
