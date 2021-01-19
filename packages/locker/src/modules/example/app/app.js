import { LightningElement } from 'lwc';

export default class LockerApp extends LightningElement {
    constructor(...args) {
        super(...args);
        //I can set cookies becuase I am a trusted component
        document.cookie = 'secret=Trusted Information';
    }
}
