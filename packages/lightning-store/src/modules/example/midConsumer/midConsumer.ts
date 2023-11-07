import { api, LightningElement } from 'lwc';
import type Cart from 'stores/cart';

export default class MidConsumer extends LightningElement {
    // TODO - how does LWC handle @api in TypeScript when value is not set by constructor?
    @api
    cart?: Cart;

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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.cart!.addToCart();
    }
}
