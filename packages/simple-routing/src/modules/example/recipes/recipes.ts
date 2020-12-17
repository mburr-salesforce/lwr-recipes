import { LightningElement } from 'lwc';
import { RECIPES } from './defaultRecipes';

export default class Recipes extends LightningElement {
    recipes = RECIPES;
}
