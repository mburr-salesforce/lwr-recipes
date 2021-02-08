import { LightningElement, api } from 'lwc';

export default class MetadataItem extends LightningElement {
    @api name: string;
    @api value: string;

    constructor() {
        super();
        this.name = '';
        this.value = '';
    }
}
