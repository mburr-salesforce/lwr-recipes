import LightningStore from 'stores/lightningStore';
import { registerStore } from 'stores/lightningStore';

export default class PageReference extends LightningStore {
    constructor() {
        super();
        registerStore('foo', this);
    }

    get url(): string {
        return document.location.href;
    }
}
