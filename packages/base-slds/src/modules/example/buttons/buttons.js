import { LightningElement } from 'lwc';

export default class Buttons extends LightningElement {
    handleClick(event) {
        console.log(`You clicked the "${event.target.label}" button`);
    }
}
