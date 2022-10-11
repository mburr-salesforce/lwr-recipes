import { LightningElement, api } from 'lwc';

interface Page {
    name: string;
    href: string;
    selected: boolean;
}

export default class ExampleNav extends LightningElement {
    static renderMode = 'light';
    @api page = 'home'; // The page/route id is passed as an HTML attribute by the layout template: "/src/layouts/chrome.njk"
    pages: Page[] = [
        { name: 'Home', href: '/', selected: false },
        { name: 'Books', href: '/books/beverly+cleary', selected: false },
    ];

    get links(): Page[] {
        return this.pages.map((page) =>
            this.page.startsWith(page.name.toLocaleLowerCase()) ? { ...page, selected: true } : page,
        );
    }
}
