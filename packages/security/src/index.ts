import { createServer } from 'lwr';
import Helmet from 'helmet'; // https://helmetjs.github.io/

// Create the LWR App Server
const lwrServer = createServer();

// Get the internal express app
const expressApp = lwrServer.getInternalServer<'express'>();

// Use Helmet to enable several out of the box security headers
expressApp.use(
    Helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'"],
                scriptSrc: ["'self'", 'salesforce.com'],
            },
        },
    }),
);

// Start the server
lwrServer
    .listen(({ port, serverMode }: { port: number; serverMode: string }) => {
        console.log(`App listening on port ${port} in ${serverMode} mode\n`);
    })
    .catch((err: Error) => {
        console.error(err);
        process.exit(1);
    });
