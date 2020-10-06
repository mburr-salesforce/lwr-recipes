import { LightningElement } from 'lwc';
import { log } from 'example/logger';
import setupInvalidationHook from 'example/invalidationHook';

export default class ServicesApp extends LightningElement {
    connectedCallback() {
        setupInvalidationHook();
    }

    logMessage() {
        log(`It is ${new Date().toLocaleTimeString()}`);
    }

    async loadDynamic() {
        const dynamicModule = await import('example/dynamic');
        dynamicModule.start();
    }
}