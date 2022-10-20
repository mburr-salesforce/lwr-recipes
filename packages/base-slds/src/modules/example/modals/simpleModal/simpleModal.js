import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class SimpleModal extends LightningModal {
    @api content;
    @api showFooter;
    @api showHeader;

    // getters/setters
    get _showHeader() {
        return this.showHeader === undefined ? true : this.showHeader;
    }

    get _showFooter() {
        return this.showFooter === undefined ? true : this.showFooter;
    }

    // event handler functions
    handleClick() {
        this.close('Close me');
    }
}
