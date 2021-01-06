import LWR from '@lwrjs/core';
import type { LwrGlobalConfig } from '@lwrjs/types';

function createApp(config?: LwrGlobalConfig) {
    return LWR(config);
}
export = createApp;
