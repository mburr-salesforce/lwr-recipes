import { LightningElement } from 'lwc';
import type Cart from 'stores/cart';
import { useStore } from 'stores/lightningStore';

export default class LowConsumerWrapper extends LightningElement {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    cart: Cart = useStore<Cart>(this, 'low-cart')!;

    constructor() {
        super();

        // mimic LWC reactivity
        setInterval(() => {
            const saveCart = this.cart;
            this.cart = undefined as any;
            this.cart = saveCart;
        }, 200);
    }
}
