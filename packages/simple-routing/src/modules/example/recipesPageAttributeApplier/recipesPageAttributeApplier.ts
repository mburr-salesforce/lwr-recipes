/* eslint-disable @typescript-eslint/no-explicit-any */
import { LightningElement, wire } from 'lwc';
import { CurrentRoute } from 'lwr/navigation';
import { RouteInstance } from 'lwr/router';

export default class RecipesItem extends LightningElement {
    @wire(CurrentRoute as any)
    route?: RouteInstance;
}
