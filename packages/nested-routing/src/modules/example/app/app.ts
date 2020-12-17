import { LightningElement } from 'lwc';
import { createRootRouter } from 'example/rootRouter';
import { NAV_ITEMS } from './navItems';

export default class NestedRoutingApp extends LightningElement {
    router = createRootRouter();
    navItems = NAV_ITEMS;
}
