import { LightningElement } from 'lwc';

export default class Home extends LightningElement {
    get productRoute() {
        return {
            type: 'namedPage',
            attributes: {
                pageName: 'products',
            },
        };
    }
}
