import { createRouter } from 'lwr/router';
import type { RouteDefinition, RouteHandlerModule, Router, PageReference } from 'lwr/router';

const routes: RouteDefinition[] = [
    {
        id: 'home',
        path: '/',
        handler: (): Promise<RouteHandlerModule> => import('example/homePageHandler'),
        page: {
            type: 'home',
        },
    },
    {
        id: 'namedPage',
        path: '/:pageName',
        handler: (): Promise<RouteHandlerModule> => import('example/namedPageHandler'),
        page: {
            type: 'namedPage',
        },
    },
    {
        id: 'recipes',
        path: '/recipes/:title/:ingredients',
        handler: (): Promise<RouteHandlerModule> => import('example/recipesPageHandler'),
        page: {
            type: 'recipes',
        },
    },
];

export function createRootRouter(): Router<PageReference> {
    return createRouter({ routes });
}
