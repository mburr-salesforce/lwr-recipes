import { LightningElement } from 'lwc';
import { ITEMS } from './items';

export default class Data extends LightningElement {
    data = ITEMS;
    columns = [
        { label: 'Label', fieldName: 'name' },
        { label: 'Website', fieldName: 'website', type: 'url' },
        { label: 'Phone', fieldName: 'phone', type: 'phone' },
        { label: 'Balance', fieldName: 'amount', type: 'currency' },
        { label: 'CloseAt', fieldName: 'closeAt', type: 'date' },
    ];
    rowOffset = 0;
}