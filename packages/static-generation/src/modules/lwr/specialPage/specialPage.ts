import { LightningElement } from 'lwc';

export default class Special extends LightningElement {
    unique_id = parseInt(window.location.href.slice(-1));

    items = ['🍓 Strawberry Milk', '🧇 Croffle', '🍡 Mochi', '🍨 Yogurt Parfait', '🍮 Flan'];
    descriptions = [
        'A sweet, refreshing cup of milk with homemade strawberry puree',
        'A crispy and light croissant and waffle hybrid',
        'A delightful, chewy dessert',
        'A fun, refreshing combination of fruit and yogurt',
        'A soft, creamy custard dish',
    ];

    unique_item = this.items[this.unique_id];
    unique_description = this.descriptions[this.unique_id];
}
