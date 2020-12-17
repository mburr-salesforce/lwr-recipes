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
        label: 'Animals',
        pageReference: {
            type: 'animal',
            attributes: {},
            state: {},
        },
    },
];
