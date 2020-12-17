import LWR, { LwrApp } from '@lwrjs/core';
const lwrApp: LwrApp = LWR();
lwrApp
    .listen(({ port, serverMode }) => {
        console.log(`App listening on port ${port} in ${serverMode} mode`);
    })
    .catch((err: Error) => {
        console.error(err);
        process.exit(1);
    });