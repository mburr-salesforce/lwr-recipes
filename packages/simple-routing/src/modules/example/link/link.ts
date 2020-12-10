/* eslint-disable @typescript-eslint/no-explicit-any */
import { LightningElement, api, track, wire } from 'lwc';
import { NavigationContext, generateUrl, navigate } from 'lwr/navigation';
import type { ContextId } from 'lwr/navigation';
import type { PageReference } from 'lwr/router';

export default class Link extends LightningElement {
    @api pageReference?: PageReference;
    @track path?: string;
    @api label?: string;

    @wire(NavigationContext as any)
    navContext?: ContextId;

    async connectedCallback(): Promise<void> {
        if (this.pageReference && this.navContext) {
            this.path = generateUrl(this.navContext, this.pageReference) || undefined;
        }
    }

    handleClick(event: Event): void {
        event.preventDefault();
        if (this.pageReference && this.navContext) {
            navigate(this.navContext, this.pageReference);
        }
    }
}
