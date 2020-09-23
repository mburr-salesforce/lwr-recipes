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
        label: 'Recipes',
        pageReference: {
            type: 'namedPage',
            attributes: {
                pageName: 'recipes',
            },
            state: {},
        },
    }
];
