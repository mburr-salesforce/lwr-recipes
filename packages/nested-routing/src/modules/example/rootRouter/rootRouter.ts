import { createRouter } from 'lwr/router';
import type { RouteDefinition, RouteHandlerModule, Router, PageReference } from 'lwr/router';

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
        },
        exact: false,
    },
];

export function createRootRouter(): Router<PageReference> {
    return createRouter({ routes });
}
