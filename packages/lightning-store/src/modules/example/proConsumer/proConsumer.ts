import { LightningElement } from 'lwc';
import Cart from 'stores/cart';

export default class ProConsumer extends LightningElement {
    cart: Cart = new Cart();

    constructor() {
        super();

        // mimic LWC reactivity
        setInterval(() => {
            const saveCart = this.cart;
            this.cart = undefined as any;
            this.cart = saveCart;
        }, 200);
    }

    addToCart(): Promise<void> {
        return this.cart.addToCart();
    }
}
