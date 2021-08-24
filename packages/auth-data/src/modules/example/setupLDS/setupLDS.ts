import { Luvio, Store, Environment } from '@luvio/engine';
import { setDefaultLuvio } from '@salesforce/lds-default-luvio';
import { createNetworkAdapter } from './network';

// Set the default Luvio instance on this app page to enable LDS

export default function (): void {
    // Get the auth info out of localStorage set by "example/loginLink"
    const authInfoStr = localStorage.getItem('auth');
    const authInfo = authInfoStr ? JSON.parse(authInfoStr) : {};
    const { instance_url, access_token } = authInfo;

    // Create a fetch-based "web" network adapter with authentication headers
    const networkAdapter = createNetworkAdapter(instance_url, access_token);
    const luvio = new Luvio(new Environment(new Store(), networkAdapter));
    setDefaultLuvio({ luvio });
}
