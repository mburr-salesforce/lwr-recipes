import type { RouteHandlerCallback, Module, RouteInstance } from 'lwr/router';

export default class RecordPageHandler {
    callback: RouteHandlerCallback;

    constructor(callback: RouteHandlerCallback) {
        this.callback = callback;
    }

    dispose(): void {
        /* noop */
    }

    update(routeInstance: RouteInstance): void {
        const { attributes } = routeInstance;
        let viewGetter;
        switch (attributes.pageName) {
            case 'products':
                viewGetter = (): Promise<Module> => import('example/products');
                break;
            case 'recipes':
                viewGetter = (): Promise<Module> => import('example/recipes');
                break;
            case 'contact':
                viewGetter = (): Promise<Module> => import('example/contact');
                break;
            default:
                return;
        }

        this.callback({
            viewset: {
                default: viewGetter,
            },
        });
    }
}
