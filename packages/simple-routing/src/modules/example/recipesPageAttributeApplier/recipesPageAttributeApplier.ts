/* eslint-disable @typescript-eslint/no-explicit-any */
import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lwr/navigation';
import { PageReference } from 'lwr/router';

export default class RecipesItem extends LightningElement {
    @wire(CurrentPageReference as any)
    pageReference?: PageReference;
}
