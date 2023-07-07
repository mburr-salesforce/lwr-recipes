import { LightningElement } from 'lwc';

const VISIT_KEY = 'lwr-ssr-recipe-last-visited-date';

export default class ExampleVisit extends LightningElement {
    static renderMode = 'light';

    lastVisitDate = '-';

    connectedCallback(): void {
        if (!import.meta.env.SSR) {
            // localStorage is only accessible on the client; it will fail during SSR
            const lastVisitDate = localStorage.getItem(VISIT_KEY);
            lastVisitDate && (this.lastVisitDate = lastVisitDate);
            localStorage.setItem(VISIT_KEY, new Date().toLocaleDateString());
        }
    }

    get userIsNew(): boolean {
        return !this.lastVisitDate;
    }
}
