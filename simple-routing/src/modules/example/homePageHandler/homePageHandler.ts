export default class RecordPageHandler {
    callback: any;
    redirect: any;

    constructor(callback: any, redirect: any) {
        this.callback = callback;
        this.redirect = redirect;
    }

    dispose(): void {
        /* noop */
    }

    update(): void {
        this.callback({
            status: 200,
            viewSet: {
                default: (): Promise<any> => import('example/home'),
            },
        });
    }
}
