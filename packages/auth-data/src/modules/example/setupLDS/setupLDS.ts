import { Luvio, Store, Environment } from '@luvio/engine';
import { setDefaultLuvio } from '@salesforce/lds-default-luvio';
import { createNetworkAdapter } from './network';

// Set the default Luvio instance on this app page to enable LDS

export default function (): void {
    // Create a fetch-based "web" network adapter with authentication headers
    const networkAdapter = createNetworkAdapter();
    const luvio = new Luvio(new Environment(new Store(), networkAdapter));
    setDefaultLuvio({ luvio });
}
