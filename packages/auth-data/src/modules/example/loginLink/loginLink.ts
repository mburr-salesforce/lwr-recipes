import { LightningElement, api } from 'lwc';

const LOCALSTORAGE_KEY = 'auth';

export default class SampleLoginLink extends LightningElement {
    /**
     * See https://help.salesforce.com/articleView?id=sf.remoteaccess_oauth_user_agent_flow.htm&type=5
     * OAuth 2.0 User-Agent Flow properties:
     */
    @api authOrigin: string | undefined;
    @api consumerKey: string | undefined;

    get showLoginLink(): boolean {
        // Authentication is only possible with this developer input
        return !!this.authOrigin && !!this.consumerKey;
    }

    get redirectUri(): string {
        // The 'redirect_url' is the current page
        // The current page address must be set as a "Callback URL" for the connected app
        const { origin, pathname } = window.location;
        return encodeURIComponent(`${origin}${pathname}`);
    }

    get loginHref(): string {
        // This URL kicks off the User-Agent OAuth Flow
        // The 'redirect_uri' points back here, where the 'connectedCallback' processes the auth info
        return `${this.authOrigin}/services/oauth2/authorize?client_id=${this.consumerKey}&redirect_uri=${this.redirectUri}&response_type=token`;
    }

    async connectedCallback(): Promise<void> {
        // This page is processing User-Agent OAuth 'redirect_uri', which receives the auth info as URL hash
        const authInfo: Record<string, string> = {};
        const authParams = new URLSearchParams(window.location.hash.substring(1));
        authParams.forEach((value, key) => (authInfo[key] = value));

        if (authInfo.access_token && authInfo.instance_url) {
            // Put the AuthInfo in localStorage
            localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(authInfo));

            // Remove the auth info from the hash AND browser history for security
            // Note: This reloads the page
            const { origin, pathname, search } = window.location;
            window.location.replace(`${origin}${pathname}${search}`);
        }
    }
}
