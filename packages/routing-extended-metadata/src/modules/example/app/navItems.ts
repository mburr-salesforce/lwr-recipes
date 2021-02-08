import type { NavData } from 'example/navItem';

export const NAV_ITEMS: NavData[] = [
    {
        id: '1',
        label: 'Metadata Page 1',
        pageReference: {
            type: 'home',
            attributes: {},
            state: {},
        },
    },
    {
        id: '2',
        label: 'Metadata Page 2',
        pageReference: {
            type: 'namedPage',
            attributes: {
                pageName: 'metadata',
            },
            state: {},
        },
    },
];
