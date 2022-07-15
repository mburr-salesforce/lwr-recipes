import type { RouteHandlerCallback, RouteInstance, Module } from 'lwr/router';

export default class AnimalPageHandler {
    callback: RouteHandlerCallback;

    constructor(callback: RouteHandlerCallback) {
        this.callback = callback;
    }

    dispose(): void {
        /* noop */
    }

    update(routeInstance: RouteInstance): void {
        const { attributes } = routeInstance;
        let defaultViewGetter, footerViewGetter, sidebarViewGetter;

        switch (attributes.pageName) {
            case 'animal':
                defaultViewGetter = (): Promise<Module> => import('example/animal');
                footerViewGetter = (): Promise<Module> => import('example/animalFooter');
                sidebarViewGetter = (): Promise<Module> => import('example/animalSidebar');
                break;
            case 'misc':
                defaultViewGetter = (): Promise<Module> => import('example/misc');
                footerViewGetter = (): Promise<Module> => import('example/miscFooter');
                sidebarViewGetter = (): Promise<Module> => import('example/miscSidebar');
                break;
            default:
                return;
        }

        this.callback({
            viewset: {
                default: defaultViewGetter,
                footer: footerViewGetter,
                sidebar: sidebarViewGetter,
            },
        });
    }
}
