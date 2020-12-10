import createApp from './index';

createApp()
    .listen(({ port, serverMode }) => {
        console.log(`SimpleRouting listening on port ${port} in ${serverMode} mode`);
    })
    .catch((err: Error) => {
        console.error(err);
        process.exit(1);
    });