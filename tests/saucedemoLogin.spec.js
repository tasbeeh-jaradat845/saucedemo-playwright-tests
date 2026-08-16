import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

const CREDENTIALS_MISMATCH_ERROR = 'Epic sadface: Username and password do not match any user in this service';

test.describe('Saucedemo login', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('login with valid credentials navigates to the products page', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(loginPage.productsTitle).toHaveText('Products');
  });

  const invalidLoginCases = [
    {
      description: 'empty username and empty password',
      username: '',
      password: '',
      expectedError: 'Epic sadface: Username is required',
    },
    {
      description: 'empty username and valid password',
      username: '',
      password: 'secret_sauce',
      expectedError: 'Epic sadface: Username is required',
    },
    {
      description: 'valid username and empty password',
      username: 'standard_user',
      password: '',
      expectedError: 'Epic sadface: Password is required',
    },
    {
      description: 'valid username and wrong password',
      username: 'standard_user',
      password: 'wrong_password',
      expectedError: CREDENTIALS_MISMATCH_ERROR,
    },
    {
      description: 'wrong username and valid password',
      username: 'wrong_username',
      password: 'secret_sauce',
      expectedError: CREDENTIALS_MISMATCH_ERROR,
    },
    {
      description: 'wrong username and wrong password',
      username: 'wrong_username',
      password: 'wrong_password',
      expectedError: CREDENTIALS_MISMATCH_ERROR,
    },
    {
      description: 'leading/trailing whitespace on valid credentials',
      username: '  standard_user  ',
      password: '  secret_sauce  ',
      expectedError: CREDENTIALS_MISMATCH_ERROR,
    },
    {
      description: 'wrong-case valid credentials',
      username: 'Standard_User',
      password: 'Secret_Sauce',
      expectedError: CREDENTIALS_MISMATCH_ERROR,
    },
    {
      description: 'SQL-injection-style input',
      username: "' OR '1'='1",
      password: "' OR '1'='1",
      expectedError: CREDENTIALS_MISMATCH_ERROR,
    },
    {
      description: 'whitespace-only username and password',
      username: '   ',
      password: '   ',
      expectedError: CREDENTIALS_MISMATCH_ERROR,
    },
  ];

  for (const { description, username, password, expectedError } of invalidLoginCases) {
    test(`login with ${description} shows the correct error`, async () => {
      await loginPage.login(username, password);

      await expect(loginPage.errorMessage).toHaveText(expectedError);
    });
  }

  const validSpecialUsers = ['problem_user', 'performance_glitch_user', 'error_user', 'visual_user'];

  for (const username of validSpecialUsers) {
    test(`login as ${username} navigates to the products page`, async ({ page }) => {
      await loginPage.login(username, 'secret_sauce');

      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(loginPage.productsTitle).toHaveText('Products');
    });
  }

  test('login as locked_out_user shows a locked-out error', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('login submits via Enter key in the password field', async ({ page }) => {
    await loginPage.usernameInput.fill('standard_user');
    await loginPage.passwordInput.fill('secret_sauce');
    await loginPage.passwordInput.press('Enter');

    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(loginPage.productsTitle).toHaveText('Products');
  });

  test('closing the error banner hides the error message', async () => {
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toBeVisible();

    await loginPage.errorCloseButton.click();

    await expect(loginPage.errorMessage).toBeHidden();
  });

  test('password field masks input', async () => {
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('direct navigation to inventory.html without logging in redirects to the login page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.errorMessage).toHaveText(
      "Epic sadface: You can only access '/inventory.html' when you are logged in."
    );
  });
});
