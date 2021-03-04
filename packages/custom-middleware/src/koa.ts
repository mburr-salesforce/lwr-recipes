import { createServer } from 'lwr';

// Create the LWR App Server with Koa - https://koajs.com/
// Note: serverType can be set directly in the lwr.config.json
const lwrServer = createServer({ serverType: 'koa' });

// Get the Koa app
const koaApp = lwrServer.getInternalServer<'koa'>();

// Add koa middleware directly
koaApp.use(async (ctx, next) => {
    ctx.response.set('koa-custom-header', 'Koa middleware is running!');
    await next();
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
