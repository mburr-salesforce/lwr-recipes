import { createServer, LwrGlobalConfig } from 'lwr';

export interface Options {
    config: Partial<LwrGlobalConfig>;
}

export default class LWRServiceLauncher {
    config;

    constructor({ config }: Options) {
        this.config = config;
    }

    async onPrepare(): Promise<void> {
        await createServer(this.config).listen(({ port, serverMode }) => {
            console.log(`[LWR Service] App listening on port ${port} in ${serverMode} mode\n`);
        });
    }
}
