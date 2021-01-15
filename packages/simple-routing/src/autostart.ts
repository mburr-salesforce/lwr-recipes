import createApp from './index';

createApp().then((lwrApp) => {
    lwrApp
        .listen(({ port, serverMode }: { port: number; serverMode: string }) => {
            console.log(`SimpleRouting listening on port ${port} in ${serverMode} mode`);
        })
        .catch((err: Error) => {
            console.error(err);
            process.exit(1);
        });
});
