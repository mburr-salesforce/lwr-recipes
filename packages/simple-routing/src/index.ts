import { createServer } from 'lwr';
import type { LwrApp } from '@lwrjs/core';
import type { LwrGlobalConfig } from 'lwr';

function createApp(config?: LwrGlobalConfig): Promise<LwrApp> {
    return Promise.resolve(createServer(config));
}
export = createApp;
