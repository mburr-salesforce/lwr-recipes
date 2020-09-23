import { LightningElement, api } from 'lwc';

export default class RecipesItem extends LightningElement {
    @api title: string;
    @api ingredients: string;

    constructor() {
        super();
        this.title = '';
        this.ingredients = '';
    }

    get foodStuffs(): string[] {
        return this.ingredients ? this.ingredients.split(';').filter((i: string) => i) : [];
    }

    get ingredientsLabel(): string {
        return `${this.title} Ingredients`;
    }

    get instructions(): string {
        return `${this.title} Instructions`;
    }
}
