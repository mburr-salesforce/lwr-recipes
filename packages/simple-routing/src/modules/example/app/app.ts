import { LightningElement } from 'lwc';
import { createRootRouter } from 'example/rootRouter';
import { NAV_ITEMS } from './navItems';

export default class SimpleRoutingApp extends LightningElement {
    router = createRootRouter();
    navItems = NAV_ITEMS;

    onViewChange(viewChangeEvent: CustomEvent): void {
        // handle viewchange
        const viewCtor = viewChangeEvent.detail;
        console.log('new view component: ', viewCtor);
    }

    onViewError(viewErrorEvent: CustomEvent): void {
        // handle viewerror
        const { error, stack } = viewErrorEvent.detail;
        console.error(`error rendering view component: "${error.message}" from:\n${stack}`);
    }
}
