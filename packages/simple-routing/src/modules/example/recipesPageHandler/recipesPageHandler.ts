import type { Module, RouteHandlerCallback } from 'lwr/router';

export default class RecipesPageHandler {
    callback: RouteHandlerCallback;

    constructor(callback: RouteHandlerCallback) {
        this.callback = callback;
    }

    dispose(): void {
        /* noop */
    }

    update(): void {
        this.callback({
            viewset: {
                default: (): Promise<Module> => import('example/recipesPageAttributeApplier'),
            },
        });
    }
}
