import type { RouteHandlerCallback, RouteInstance, Module } from 'lwr/router';

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
            case 'dog':
                viewGetter = (): Promise<Module> => import('example/animalDog');
                break;
            case 'cat':
                viewGetter = (): Promise<Module> => import('example/animalCat');
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
