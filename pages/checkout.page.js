export class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.orderItems = page.locator('.cart_item');
        this.productName = this.orderItems.locator('.inventory_item_name');
        this.productPrice = this.orderItems.locator('.inventory_item_price');
        this.productQuantity = this.orderItems.locator('.cart_quantity');

        this.subtotal = page.locator('.summary_subtotal_label');
        this.tax = page.locator('.summary_tax_label');
        this.total = page.locator('.summary_total_label');

        this.finishButton = page.getByRole('button', { name: 'Finish' });

        this.confirmationMessage = page.locator('.complete-header');
    }

    async enterCustomerInformation(firstName, lastName, postalCode) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async continueToOverview() {
        await this.continueButton.click();
    }

    async finishOrder() {
        await this.finishButton.click();
    }
}