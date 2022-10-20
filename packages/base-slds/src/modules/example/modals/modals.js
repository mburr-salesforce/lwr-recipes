import { LightningElement } from 'lwc';
import SimpleModal from './simpleModal/SimpleModal';
import FormModal from './formModal/FormModal';

export default class Modals extends LightningElement {
    _result = 'unset';
    _selection;

    handleBasicClick() {
        SimpleModal.open({
            size: 'medium',
            description: "Accessible description of modal's purpose",
            content: 'Content passed into the modal',
            showHeader: true,
            showFooter: true,
        }).then((result) => {
            this._result = result || 'dismiss';
        });
    }

    handleHeadlessClick() {
        SimpleModal.open({
            size: 'small',
            description: "Accessible description of modal's purpose",
            content: 'This is a headless modal.',
            showHeader: false,
            showFooter: true,
        }).then((result) => {
            this._result = result || 'dismiss headless';
        });
    }

    handleFootlessClick() {
        SimpleModal.open({
            size: 'small',
            description: "Accessible description of modal's purpose",
            content: 'This is a footless modal.',
            showHeader: true,
            showFooter: false,
        }).then((result) => {
            this._result = result || 'dismiss footless';
        });
    }

    handleFormClick() {
        FormModal.open({
            description: "Accessible description of modal's purpose",
            radioOptions: [
                { label: 'Sales', value: 'option1' },
                { label: 'Force', value: 'option2' },
            ],
            inputValue: 'some great text',
            onchange: (event) => {
                this.handleRadioChange(event);
            },
        }).then((result) => {
            this._result = JSON.stringify(result) || 'dismiss modal form';
        });
    }

    handleRadioChange(event) {
        this._selection = event.detail.value;
    }
}
