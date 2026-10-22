export class InventoryPage {
constructor(page) {
    this.page = page;
    this.inventoryItem=page.locator('.inventory_item');
    this.cartBadge=page.locator('.shopping_cart_badge');
    this.shoppingCartLink=page.locator('.shopping_cart_link');
}  
product(productName) {
        return this.inventoryItem.filter({
      has: this.page.getByText(productName),
    });
}

async addProductToCart(productName) {
    await this.product(productName).getByRole('button', { name: 'Add to Cart' }).click();
}

async openCart() {
    await this.shoppingCartLink.click();
}
}







