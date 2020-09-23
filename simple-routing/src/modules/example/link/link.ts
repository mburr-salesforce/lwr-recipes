import { LightningElement, api, wire } from 'lwc';
import { NavigationContext, navigate, generateUrl, subscribe } from 'lwr/navigation';

export default class Link extends LightningElement {
    @api path: any;
    @api label: any;
    subscription: any;
    anchor: any;

    @wire(NavigationContext as any)
    navContext: any;

    connectedCallback(): void {
        this.subscription = subscribe(this.navContext, async (route: any) => {
            const url = await generateUrl(this.navContext, route);
            this.anchor.className = url === this.path ? 'selected' : '';
        });
    }

    renderedCallback(): void {
        this.anchor = (this.template as unknown as Document).querySelector('a');
    }

    handleClick(event: any): void {
        event.preventDefault();
        navigate(this.navContext, this.path);
    }
}
