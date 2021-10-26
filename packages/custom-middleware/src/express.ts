import { createServer } from 'lwr';

// Create the LWR App Server with Express - http://expressjs.com/en/api.html
// Note: serverType can be set directly in the lwr.config.json
const lwrServer = createServer({ serverType: 'express' });

// Get the express app
const expressApp = lwrServer.getInternalServer<'express'>();

// Add Express middleware directly
expressApp.use(async (req, res, next) => {
    res.setHeader('express-custom-header', 'Express middleware is running!');
    next();
});

// Start the server
lwrServer
    .listen(({ port, serverMode }: { port: number; serverMode: string }) => {
        console.log(`App listening on port ${port} in ${serverMode} mode\n`);
    })
    .catch((err: Error) => {
        console.error(err);
        process.exit(1);
    });
