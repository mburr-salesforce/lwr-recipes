import { LwrGlobalConfig } from 'lwr';
import simpleRoutingApp from 'simple-routing';

export interface Options {
    config: Partial<LwrGlobalConfig>;
}

export default class LWRServiceLauncher {
    config;

    constructor({ config }: Options) {
        this.config = config;
    }

    async onPrepare(): Promise<void> {
        await (
            await simpleRoutingApp(this.config)
        ).listen(({ port, serverMode }) => {
            console.log(`[Simple Routing App] listening on port ${port} in ${serverMode} mode\n`);
        });
    }
}
