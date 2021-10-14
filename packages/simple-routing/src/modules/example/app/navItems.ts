import type { NavData } from 'example/navItem';

export const NAV_ITEMS: NavData[] = [
    {
        id: '1',
        label: 'Home',
        pageReference: {
            type: 'home',
            attributes: {},
            state: {},
        },
    },
    {
        id: '2',
        label: 'Products',
        pageReference: {
            type: 'namedPage',
            attributes: {
                pageName: 'products',
            },
            state: {},
        },
    },
    {
        id: '3',
        label: 'Recipes',
        pageReference: {
            type: 'namedPage',
            attributes: {
                pageName: 'recipes',
            },
            state: {},
        },
    },
    {
        id: '4',
        label: 'Contact',
        pageReference: {
            type: 'namedPage',
            attributes: {
                pageName: 'contact',
            },
            state: {},
        },
    },
    {
        id: '5',
        label: 'Error Page',
        pageReference: {
            type: 'namedPage',
            attributes: {
                pageName: 'pageHasError',
            },
            state: {},
        },
    },
];
