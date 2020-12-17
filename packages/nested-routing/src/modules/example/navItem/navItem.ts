/* eslint-disable @typescript-eslint/no-explicit-any */
import { LightningElement, api } from 'lwc';
import type { PageReference } from 'lwr/router';

export interface NavData {
    id: string;
    label: string;
    pageReference: PageReference;
}

export default class NavItem extends LightningElement {
    @api label: string;
    @api pageReference?: PageReference;
    _selected = false;

    constructor() {
        super();
        this.label = '';
    }

    @api
    get selected(): boolean {
        return this._selected;
    }
    set selected(newValue) {
        this._selected = newValue;
        const li = (this.template as any).querySelector('li');
        if (li) {
            li.classList[newValue ? 'add' : 'remove']('active');
        }
    }
}
