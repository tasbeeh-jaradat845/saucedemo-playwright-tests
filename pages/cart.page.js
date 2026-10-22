export class CartPage {
    constructor(page) {
        this.page = page;
        this.cartItem = page.locator('.cart_item');
        this.cartItemName = page.locator('.inventory_item_name');
        this.productPrice = this.cartItem.locator('.inventory_item_price');
        this.productQuantity = this.cartItem.locator('.cart_quantity');
        this.checkoutButton = page.getByRole('button', {name: 'Checkout'});
    }
    async cartItemsCount() {
        return this.cartItem.count();
    }
    cartList(){
        return this.cartItem;
    }
    async checkout() {
        await this.checkoutButton.click();
    }
}