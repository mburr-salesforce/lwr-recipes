import { LightningElement, track } from 'lwc';

export default class Contact extends LightningElement {
    @track sent = false;

    sendIt() {
        this.sent = true;
    }
}