import { Luvio, Store, Environment } from '@luvio/engine';
import { setDefaultLuvio } from '@salesforce/lds-default-luvio';
import { createNetworkAdapter } from './network';

// Set the default Luvio instance on this page
// Create a fetch-based "web" network adapter with authentication headers
function initUiApiAdapters(instance_url?: string, access_token?: string): void {
    const networkAdapter = createNetworkAdapter(instance_url, access_token);
    const luvio = new Luvio(new Environment(new Store(), networkAdapter));
    setDefaultLuvio({ luvio });
}
export { initUiApiAdapters };
