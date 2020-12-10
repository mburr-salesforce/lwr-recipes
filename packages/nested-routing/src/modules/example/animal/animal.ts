import { LightningElement } from 'lwc';
import { createChildRouter } from 'example/childRouter';
import { ANIMALS } from './defaultAnimals';

export default class AnimalPage extends LightningElement {
    childRouter = createChildRouter();
    animals = ANIMALS;
}
