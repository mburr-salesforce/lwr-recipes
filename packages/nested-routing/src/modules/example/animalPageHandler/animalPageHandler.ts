import type { RouteHandlerCallback, Module } from 'lwr/router';

export default class RecordPageHandler {
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
                default: (): Promise<Module> => import('example/animal'),
            },
        });
    }
}
