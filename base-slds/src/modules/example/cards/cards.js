import { LightningElement } from 'lwc';

export default class Cards extends LightningElement {
    value = '<none>';
    date = new Date().getTime();

    get options() {
        return [
            { label: 'Top', value: 'top' },
            { label: 'Middle', value: 'middle' },
            { label: 'Bottom', value: 'bottom' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }

    handleClick(event) {
        console.log(`You clicked the "${event.target.label}" card button`);
    }
}