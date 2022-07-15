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
        label: 'Animal',
        pageReference: {
            type: 'animal',
            attributes: { pageName: 'animal' },
            state: {},
        },
    },
    {
        id: '3',
        label: 'Misc',
        pageReference: {
            type: 'misc',
            attributes: { pageName: 'misc' },
            state: {},
        },
    },
];
