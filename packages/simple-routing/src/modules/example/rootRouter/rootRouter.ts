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
        id: 'namedPage',
        uri: '/:pageName',
        handler: (): Promise<RouteHandlerModule> => import('example/namedPageHandler'),
        page: {
            type: 'namedPage',
            attributes: {
                pageName: ':pageName',
            },
        },
    },
    {
        id: 'recipes',
        uri: '/recipes/:title?:ingredients',
        handler: (): Promise<RouteHandlerModule> => import('example/recipesPageHandler'),
        page: {
            type: 'recipes',
            attributes: {
                title: ':title',
                ingredients: ':ingredients',
            },
        },
    },
];

export function createRootRouter(): Router<PageReference> {
    return createRouter({ routes });
}
