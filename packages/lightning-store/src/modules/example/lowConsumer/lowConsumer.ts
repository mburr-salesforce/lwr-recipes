import { api, LightningElement } from 'lwc';

export default class LowConsumer extends LightningElement {
    @api
    count?: number;

    @api
    updatingCart?: boolean;

    @api
    addToCart?: Function;

    myAddToCart(): void {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const quantity = Number(this.template.querySelector('input')!.value);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.addToCart!(quantity);
    }
}
