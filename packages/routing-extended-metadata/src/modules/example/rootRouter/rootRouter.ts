import { createRouter } from 'lwr/router';
import type { RouteHandlerModule, Router, PageReference } from 'lwr/router';
import type { ExtendedRouteDefinition } from 'example/currentRouteMetadata';

const routes: ExtendedRouteDefinition[] = [
    {
        id: 'home',
        uri: '/',
        handler: (): Promise<RouteHandlerModule> => import('example/metadataPageHandler'),
        page: {
            type: 'home',
        },
        metadata: {
            isPublic: true,
            label: 'home',
            devName: 'homeDevName',
        },
    },
    {
        id: 'namedPage',
        uri: '/:pageName',
        handler: (): Promise<RouteHandlerModule> => import('example/metadataPageHandler'),
        page: {
            type: 'namedPage',
            attributes: {
                pageName: ':pageName',
            },
        },
        metadata: {
            isPublic: true,
            label: 'page2',
            devName: 'page2DevName',
        },
    },
];

export function createRootRouter(): Router<PageReference> {
    return createRouter({ routes });
}
