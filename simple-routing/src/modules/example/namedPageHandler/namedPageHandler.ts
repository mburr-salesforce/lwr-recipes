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

    update(routeInstance: any): void {
        const { attributes } = routeInstance;
        let viewGetter;
        switch (attributes.pageName) {
            case 'about':
                viewGetter = (): Promise<any> => import('example/about');
                break;
            case 'chart':
                viewGetter = (): Promise<any> => import('example/chart');
                break;
            default:
                this.callback({
                    status: 500,
                });
                return;
        }

        this.callback({
            status: 200,
            viewSet: {
                default: viewGetter,
            },
        });
    }
}
