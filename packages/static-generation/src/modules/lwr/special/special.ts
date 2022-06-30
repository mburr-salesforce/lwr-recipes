import { LightningElement } from 'lwc';

export default class Special extends LightningElement {
    unique_id = Math.floor(Math.random() * 5);

    getSpecialRecipe(): void {
        location.href = `/recipes/${this.unique_id}`;
    }
}
