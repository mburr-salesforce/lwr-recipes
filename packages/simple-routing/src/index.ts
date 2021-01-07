import { createServerAsync } from 'lwr';
import type { LwrApp } from '@lwrjs/core';
import type { LwrGlobalConfig } from '@lwrjs/types';

function createApp(config?: LwrGlobalConfig): Promise<LwrApp> {
    return createServerAsync(config);
}
export = createApp;
