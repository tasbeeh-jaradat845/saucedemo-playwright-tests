import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { InventoryPage } from '../pages/inventory.page.js';
import { CartPage } from '../pages/cart.page.js';
import { CheckoutPage } from '../pages/checkout.page.js';

test('successfully purchases one product', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Log in
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // Add the product
    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    await expect(inventoryPage.cartBadge).toHaveText('1');

    // Open and verify the cart
    await inventoryPage.openCart();

    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(cartPage.cartList()).toHaveCount(1);
    await expect(cartPage.cartItemName).toHaveText('Sauce Labs Backpack');
    await expect(cartPage.productPrice).toHaveText('$29.99');
    await expect(cartPage.productQuantity).toHaveText('1');

    // Start checkout
    await cartPage.checkout();

    await expect(page).toHaveURL(
        'https://www.saucedemo.com/checkout-step-one.html'
    );

    const checkoutPage = new CheckoutPage(page);

    // Fill in demo customer information
    await checkoutPage.enterCustomerInformation('Test', 'Customer', '12345');

    // Continue to the order overview
    await checkoutPage.continueToOverview();

    await expect(page).toHaveURL(
        'https://www.saucedemo.com/checkout-step-two.html'
    );

    // Verify the product in the order overview
    await expect(checkoutPage.orderItems).toHaveCount(1);
    await expect(checkoutPage.productName).toHaveText('Sauce Labs Backpack');
    await expect(checkoutPage.productPrice).toHaveText('$29.99');
    await expect(checkoutPage.productQuantity).toHaveText('1');

    // Verify the subtotal, tax, and calculated total
    const expectedSubtotal = 29.99;
    const expectedTax = 2.40;
    const expectedTotal = (expectedSubtotal + expectedTax).toFixed(2);

    await expect(checkoutPage.subtotal).toHaveText('Item total: $29.99');
    await expect(checkoutPage.tax).toHaveText('Tax: $2.40');
    await expect(checkoutPage.total).toHaveText('Total: $' + expectedTotal);

    // Complete the purchase
    await checkoutPage.finishOrder();

    await expect(page).toHaveURL(
        'https://www.saucedemo.com/checkout-complete.html'
    );

    await expect(checkoutPage.confirmationMessage).toHaveText(
        'Thank you for your order!'
    );

    // Verify the cart badge disappears after purchase
    await expect(inventoryPage.cartBadge).toBeHidden();

});