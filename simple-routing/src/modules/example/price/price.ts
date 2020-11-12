import { LightningElement, api } from 'lwc';

export default class Price extends LightningElement {
    @api sectionTitle;
    @api priceList;

    get imgPath() {
        return `/public/assets/${this.sectionTitle}.jpg`;
    }
}