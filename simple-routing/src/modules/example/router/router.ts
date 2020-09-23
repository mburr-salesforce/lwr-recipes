import { createPortableRouter } from 'lwr/router';

const routes = [
    {
        id: 'home',
        path: '/',
        handler: (): Promise<any> => import('example/homePageHandler'),
    },
    {
        id: 'namedPage',
        path: '/:pageName',
        handler: (): Promise<any> => import('example/namedPageHandler'),
    },
];

export function createRouter(): any {
    return createPortableRouter({ routes });
}
