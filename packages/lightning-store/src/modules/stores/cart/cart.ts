import LightningStore from 'stores/lightningStore';

// type Product = {
// };

export default class Cart extends LightningStore {
    // TODO - initialize from server instead, eg using LDS imperative binding w/ subscription
    count = 0;

    // TODO - initialize from server
    // products: Product[] = [];

    updatingCart = false;

    addToCart(quantity = 1): Promise<void> {
        this.count += quantity;

        this.updatingCart = true;

        // mimic 1s trip to server
        return new Promise((resolve) =>
            setTimeout(() => {
                this.updatingCart = false;
                resolve();
            }, 1000),
        );
    }
}
