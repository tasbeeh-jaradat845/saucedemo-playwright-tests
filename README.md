# SauceDemo Login Tests with Playwright

An independent test automation project covering the login functionality of [SauceDemo](https://www.saucedemo.com/), built with **Playwright Test and JavaScript**.

I created this project while learning Playwright independently, building on my professional QA and automation experience. It demonstrates how I organize reusable page interactions, select positive and negative test scenarios, and configure cross-browser execution and CI.

## Test coverage

The suite contains **20 test cases**, configured to run on **Chromium, Firefox, and WebKit** (60 test executions before retries when running the full suite).

| Area | Scenarios | Cases |
| --- | --- | --- |
| Standard login | Valid credentials navigate to the inventory page and display the Products title | 1 |
| Invalid credentials | Empty fields, incorrect credentials, leading/trailing whitespace, case changes, SQL-like input, and whitespace-only input | 10 |
| Special demo users | Login as `problem_user`, `performance_glitch_user`, `error_user`, and `visual_user` | 4 |
| Locked-out user | Verify the locked-out error message | 1 |
| Keyboard interaction | Submit login with Enter from the password field | 1 |
| Error dismissal | Close the error banner and verify it is hidden | 1 |
| Password input | Verify the password field has `type="password"` | 1 |
| Unauthenticated access | Open the inventory URL without logging in and verify redirection and the error message | 1 |

Special-user tests verify login navigation only. The SQL-like input case verifies the login response; it does not establish resistance to SQL injection.

## Tools and approach

- **Playwright Test** for test execution and assertions.
- **JavaScript** with ES modules.
- **Page Object Model:** a `LoginPage` class holds locators and reusable navigation and login methods; tests contain the expected outcomes.
- **Data-driven tests:** arrays generate separate tests for invalid credentials and special users, keeping test definitions concise and results individually identifiable.
- **Locators:** placeholder and role locators for the login fields and button, with data attributes for error elements.
- **Retrying assertions:** URL, text, visibility, and attribute checks use Playwright's `expect` assertions.
- **Test isolation:** each test uses Playwright's fresh `page` fixture and opens the login page in `beforeEach`.
- **GitHub Actions** for automated execution and HTML report upload.

## Getting started

### Prerequisites

- A Node.js version supported by the installed Playwright release; use a current LTS release.
- npm and Git.
- Internet access to SauceDemo and the installation services.

### Installation

```bash
git clone https://github.com/tasbeeh-jaradat845/saucedemo-playwright-login-tests.git
cd saucedemo-playwright-login-tests
npm ci
npx playwright install
```

On Linux environments that need browser system dependencies, use `npx playwright install --with-deps` instead of `npx playwright install`.

The suite uses SauceDemo's publicly provided demo accounts, including `standard_user` with password `secret_sauce`. No personal account is required.

## Running the tests

Run all tests across the three configured browsers:

```bash
npx playwright test
```

Run Chromium only:

```bash
npx playwright test --project=chromium
```

Run Chromium with a visible browser:

```bash
npx playwright test --project=chromium --headed
```

Open Playwright's interactive UI:

```bash
npx playwright test --ui
```

List the configured tests without executing them:

```bash
npx playwright test --list
```

## Reports and debugging

The configuration uses Playwright's **HTML reporter**. After a run, open the report with:

```bash
npx playwright show-report
```

The suite allows **one retry per failed test**, both locally and in CI. Traces are collected on the first retry using `trace: 'on-first-retry'`; they are not recorded for every successful test. When a trace is available, open it from the HTML report to inspect the test's actions and page state.

Automatic screenshot and video capture are not currently enabled. Generated reports, test results, and trace ZIP files are excluded from version control.

## Continuous integration

The [Playwright Tests workflow](.github/workflows/playwright.yml) runs on pushes and pull requests targeting `main` or `master`. It:

1. Checks out the code and sets up Node.js LTS on Ubuntu.
2. Installs dependencies using `npm ci`.
3. Installs Playwright browsers and their system dependencies.
4. Executes `npx playwright test` with the configured browser projects.
5. Uploads the `playwright-report` folder as an artifact named `playwright-report`, retained for 30 days, when the job has not been cancelled and the report exists.

CI uses one worker. The configuration also prevents a committed `test.only` from passing CI.

To inspect actual execution results, open the repository's [Actions tab](https://github.com/tasbeeh-jaradat845/saucedemo-playwright-login-tests/actions). Select a completed run and download the `playwright-report` artifact if available. Extract it and open the report locally:

```bash
npx playwright show-report /path/to/extracted/playwright-report
```

Replace the example path with the folder containing `index.html`. The workflow configuration describes how CI runs; individual workflow results show whether a particular run passed.

## Project files

| File | Purpose |
| --- | --- |
| `pages/login.page.js` | Login locators and reusable page interactions |
| `tests/saucedemoLogin.spec.js` | Login scenarios, test data, and assertions |
| `playwright.config.js` | Browser projects, retries, reporting, tracing, and CI settings |
| `.github/workflows/playwright.yml` | Automated test execution and report upload |
| `package.json` / `package-lock.json` | Dependencies and locked installation versions |

## Scope and limitations

This project focuses on login and access to the inventory page. It does not currently cover cart and checkout journeys, API tests, post-login behavior of the special demo users, or dedicated security testing.

The tests exercise an externally hosted demo application. Execution depends on its availability and behavior. Browser configurations and test counts describe the suite's intended execution; passing results should be checked in a specific local or CI run.

## Sample test execution

![Playwright test execution results](test-results.png)

## Author

[Tasbeeh Jaradat](https://github.com/tasbeeh-jaradat845) — QA Engineer and independent Playwright learner.
