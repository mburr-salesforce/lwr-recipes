import { LightningElement } from 'lwc';
import { initUiApiAdapters } from 'data/uiApi';

// This is the "rootComponent" set in lwr.config.json

export default class ExampleApp extends LightningElement {
    ctor?: unknown = undefined;

    constructor() {
        super();
        // Setup Luvio and network adapters to access UI API wires/APIs
        // Get the auth info out of localStorage set by "example/loginLink"
        const authInfoStr = localStorage.getItem('auth');
        const authInfo = authInfoStr ? JSON.parse(authInfoStr) : {};
        const { instance_url, access_token } = authInfo;
        initUiApiAdapters(instance_url, access_token);
    }

    async connectedCallback(): Promise<void> {
        // The component tree which uses the UI API adapters must be
        // dynamically imported, otherwise a timing issue occurs where the
        // adapters are created before the default Luvio instance is set.
        // Note: the adapters are created in "force/ldsAdaptersUiapi" by way of "lightning/ui*Api"
        const module = await import('example/data'); // root component for data usage
        this.ctor = module.default;
    }
}
