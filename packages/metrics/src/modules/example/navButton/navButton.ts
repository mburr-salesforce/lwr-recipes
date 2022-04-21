/* eslint-disable @typescript-eslint/no-explicit-any */
import { LightningElement, api, wire } from 'lwc';
import { NavigationContext, navigate } from 'lwr/navigation';
import type { ContextId } from 'lwr/navigation';

export default class NavButton extends LightningElement {
    @api name?: string;

    @wire(NavigationContext as any)
    navContext?: ContextId;

    navigate(): void {
        if (this.navContext) {
            navigate(this.navContext, { type: this.name });
        }
    }
}
