import { LightningElement } from 'lwc';

export default class TrustedCmp extends LightningElement {
    get myCookies() {
        return document.cookie;
    }
}
