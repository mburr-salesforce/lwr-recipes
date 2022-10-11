import { createServer } from 'lwr';
import express from 'express';

const lwrApp = createServer();
const expressApp = lwrApp.getInternalServer();

// Use the pre-built resources
// Pages which have not been pre-built fall through to the LWR server
expressApp.use(express.static('__generated_site__'));

// Start the LWR server
lwrApp
    .listen(({ port, serverMode }) => {
        console.log(`App listening at http://localhost:${port} in ${serverMode} mode`);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
