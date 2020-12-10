import { createRouter } from 'lwr/router';
import type { RouteDefinition, RouteHandlerModule, Router, PageReference } from 'lwr/router';

const routes: RouteDefinition[] = [
    {
        id: 'home',
        path: '/',
        handler: (): Promise<RouteHandlerModule> => import('example/animalHomePageHandler'),
        page: {
            type: 'animalHome',
        },
    },
    {
        id: 'animal',
        path: '/:pageName',
        handler: (): Promise<RouteHandlerModule> => import('example/animalNamedPageHandler'),
        page: {
            type: 'namedAnimalPage',
        },
    },
];

export function createChildRouter(): Router<PageReference> {
    return createRouter({ routes });
}
