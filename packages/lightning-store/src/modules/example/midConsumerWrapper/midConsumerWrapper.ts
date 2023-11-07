import { LightningElement } from 'lwc';
import type Cart from 'stores/cart';
import { useStore } from 'stores/lightningStore';

export default class MidConsumerWrapper extends LightningElement {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    cart: Cart = useStore<Cart>(this, 'mid-cart')!;
}
