import { LightningElement } from 'lwc';
import { createRouter } from 'example/router';

export default class SimpleRoutingExample extends LightningElement {
    router = createRouter();
}