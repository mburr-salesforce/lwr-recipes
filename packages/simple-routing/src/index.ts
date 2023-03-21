import { createServer } from 'lwr';
import type { LwrGlobalConfig, LwrApp } from 'lwr';

function createApp(config?: LwrGlobalConfig): Promise<LwrApp> {
    return Promise.resolve(createServer(config));
}
export = createApp;
