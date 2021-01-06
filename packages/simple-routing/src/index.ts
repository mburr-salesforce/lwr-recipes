import LWR, { LwrApp } from '@lwrjs/core';
import type { LwrGlobalConfig } from '@lwrjs/types';

function createApp(config?: LwrGlobalConfig): LwrApp {
    return LWR(config);
}
export = createApp;
