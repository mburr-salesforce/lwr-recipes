import { LightningElement } from 'lwc';

export default class Counter extends LightningElement {
    count = 0;

    increaseCount(): void {
        this.count += 1;
    }
}
