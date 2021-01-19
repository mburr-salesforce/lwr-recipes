import {LightningElement} from 'lwc';

export default class TrustedCookieMonster extends LightningElement {
    get myCookies() {
        return document.cookie;
    }
}