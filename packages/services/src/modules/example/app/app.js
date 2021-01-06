import { LightningElement } from 'lwc';
import { log } from 'example/logger';

export default class ServicesApp extends LightningElement {
    logMessage() {
        log(`It is ${new Date().toLocaleTimeString()}`);
    }

    async loadDynamic() {
        const dynamicModule = await import('example/dynamic');
        dynamicModule.start();
    }
}
