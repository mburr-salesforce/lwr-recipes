import { LightningElement, api } from 'lwc';

export default class Price extends LightningElement {
    @api sectionTitle?: string;
    @api priceList?: { label: string; price: string }[];

    get imgPath(): string {
        return `/public/assets/${this.sectionTitle}.jpg`;
    }
}
