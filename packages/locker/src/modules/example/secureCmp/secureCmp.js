import { LightningElement } from 'lwc';

export default class SecureCmp extends LightningElement {
    get myCookies() {
        return document.cookie;
    }
}
