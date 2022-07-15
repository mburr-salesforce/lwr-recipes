import { LightningElement } from 'lwc';
import { createRouter } from 'lwr/router';
import type { RouteDefinition, RouteHandlerModule } from 'lwr/router';

import { NAV_ITEMS } from './navItems';

export default class MultipleRoutingApp extends LightningElement {
    router = createRouter({ routes });
    navItems = NAV_ITEMS;
}

const routes: RouteDefinition[] = [
    {
        id: 'home',
        uri: '/',
        handler: (): Promise<RouteHandlerModule> => import('example/homePageHandler'),
        page: {
            type: 'home',
        },
    },
    {
        id: 'animal',
        uri: '/animal',
        handler: (): Promise<RouteHandlerModule> => import('example/animalPageHandler'),
        page: {
            type: 'animal',
            attributes: {
                pageName: 'animal',
            },
        },
    },
    {
        id: 'misc',
        uri: '/misc',
        handler: (): Promise<RouteHandlerModule> => import('example/animalPageHandler'),
        page: {
            type: 'misc',
            attributes: {
                pageName: 'misc',
            },
        },
    },
];
