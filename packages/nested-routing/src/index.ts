import LWR from '@lwrjs/core';

const lwrApp = LWR();
lwrApp
    .listen(({ port, serverMode }) => {
        console.log(`SimpleRouting listening on port ${port} in ${serverMode} mode`);
    })
    .catch((err: Error) => {
        console.error(err);
        process.exit(1);
    });