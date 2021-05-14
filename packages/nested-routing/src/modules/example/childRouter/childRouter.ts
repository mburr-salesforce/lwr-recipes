import { createRouter } from 'lwr/router';
import type { RouteDefinition, RouteHandlerModule, Router, PageReference } from 'lwr/router';

const routes: RouteDefinition[] = [
    {
        id: 'home',
        uri: '/',
        handler: (): Promise<RouteHandlerModule> => import('example/animalHomePageHandler'),
        page: {
            type: 'animalHome',
        },
    },
    {
        id: 'animal',
        uri: '/:pageName',
        handler: (): Promise<RouteHandlerModule> => import('example/animalNamedPageHandler'),
        page: {
            type: 'namedAnimalPage',
            attributes: {
                pageName: ':pageName',
            },
        },
    },
];

export function createChildRouter(): Router<PageReference> {
    return createRouter({ routes });
}
