import { createServer } from 'lwr';
import { setupAuthMiddleware } from './server/authMiddleware';

const lwrServer = createServer({ serverType: 'express' });
const expressApp = lwrServer.getInternalServer<'express'>();

// Add OAuth middleware for a Connected App
// The consumer key and secret can be found in the App Manager
setupAuthMiddleware(expressApp, {
    myDomain: 'https://my-org.com',
    consumerKey: 'abc.123',
    consumerSecret: '******',
    redirectURI: 'http://localhost:3000/oauth',
});

lwrServer
    .listen(({ port, serverMode }: { port: number; serverMode: string }) => {
        console.log(`App listening on port ${port} in ${serverMode} mode\n`);
    })
    .catch((err: Error) => {
        console.error(err);
        process.exit(1);
    });
