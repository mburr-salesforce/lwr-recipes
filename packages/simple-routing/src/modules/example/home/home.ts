import { LightningElement } from 'lwc';
import type { PageReference } from 'lwr/router';

export default class Home extends LightningElement {
    get productRoute(): PageReference {
        return {
            type: 'namedPage',
            attributes: {
                pageName: 'products',
            },
            state: {},
        };
    }
}
