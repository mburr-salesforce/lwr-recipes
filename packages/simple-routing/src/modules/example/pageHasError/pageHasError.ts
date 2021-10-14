import { LightningElement } from 'lwc';

export default class PageHasError extends LightningElement {
    throwError(): void {
        throw new Error('Hello Error!');
    }
}
