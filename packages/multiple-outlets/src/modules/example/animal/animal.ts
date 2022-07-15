import { LightningElement } from 'lwc';

export default class AnimalPage extends LightningElement {
    title = 'Would you like to see a hedgehog or chinchilla?';

    showHedgehog(): void {
        const hedge = this.template.querySelector('.hedgehog-pic')?.classList;
        const chin = this.template.querySelector('.chinchilla-pic')?.classList;

        if (hedge !== undefined && chin !== undefined) {
            hedge.remove('pic-hidden');
            chin.add('pic-hidden');
        }
    }

    showChinchilla(): void {
        const hedge = this.template.querySelector('.hedgehog-pic')?.classList;
        const chin = this.template.querySelector('.chinchilla-pic')?.classList;

        if (hedge !== undefined && chin !== undefined) {
            chin.remove('pic-hidden');
            hedge.add('pic-hidden');
        }
    }
}
