import type { Module, RouteHandlerCallback } from 'lwr/router';

export default class HomePageHandler {
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
                // return multiple views
                default: (): Promise<Module> => import('example/home'),
                footer: (): Promise<Module> => import('example/homeFooter'),
                sidebar: (): Promise<Module> => import('example/homeSidebar'),
            },
        });
    }
}
