/* eslint-disable @typescript-eslint/no-explicit-any */
import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference, NavigationContext } from 'lwr/navigation';
import type { PageReference } from 'lwr/router';
import type { ContextId } from 'lwr/navigationContext';
import type { NavData } from 'example/navItem';

interface SelectableNavData extends NavData {
    selected: boolean;
}

export default class Nav extends LightningElement {
    @wire(NavigationContext as any)
    navContext?: ContextId;

    @wire(CurrentPageReference as any)
    selectNavItem(currentPageReference: PageReference): void {
        if (this.items) {
            const currentType = currentPageReference.type;
            const currentAttributesStr = JSON.stringify(currentPageReference.attributes);

            const selectedNavData: NavData | undefined = this.items.find((item) => {
                const equalPageIdentity =
                    currentType === item.pageReference.type &&
                    currentAttributesStr === JSON.stringify(item.pageReference.attributes);
                return (
                    equalPageIdentity ||
                    (currentType === 'recipes' &&
                        item.pageReference.type === 'namedPage' &&
                        item.pageReference.attributes.pageName === 'recipes')
                );
            });
            if (selectedNavData) {
                this.currentItemId = selectedNavData.id;
            }
        }
    }

    @api items?: NavData[];
    @track currentItemId?: string;

    withoutParams(url: string): string {
        try {
            return new URL(url, window.location.origin).pathname;
        } catch (e) {
            return '';
        }
    }

    get navItems(): SelectableNavData[] {
        return (this.items || []).map((item: NavData) => ({
            ...item,
            selected: item.id === this.currentItemId,
        }));
    }
}
