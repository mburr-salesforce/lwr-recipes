import { LightningElement } from 'lwc';
import GREETING from '@my/label/home.greeting';
import DOG_LABEL from '@my/label/animal.dog';
import CAT_LABEL from '@my/label/animal.cat';

export default class LocalizedApp extends LightningElement {
    greeting = GREETING;
    dogLabel = DOG_LABEL;
    catLabel = CAT_LABEL;
}
