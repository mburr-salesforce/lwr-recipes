import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class FormModal extends LightningModal {
    @api radioOptions;

    _inputValue;
    _radioValue;

    // getters/setters
    @api get inputValue() {
        return this._inputValue;
    }

    set inputValue(inputValue) {
        this._inputValue = inputValue;
    }

    @api get radioValue() {
        return this._radioValue;
    }

    set radioValue(radioValue) {
        this._radioValue = radioValue;
    }

    // event handler functions
    handleChange(event) {
        this._radioValue = event.target.value;
    }

    handleBlur(event) {
        this._inputValue = event.target.value;
    }

    handleClick() {
        this.close({ inputValue: this.inputValue, radioValue: this.radioValue });
    }
}
