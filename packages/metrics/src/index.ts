import express from 'express';
import { createServer } from 'lwr';

// Create the LWR App Server and get a reference to the app (with JSON)
const lwrServer = createServer();
const app = lwrServer.getInternalServer<'express'>();
app.use(express.json());

// Add middleware to accept mock metric APIs
// In production, the data would be saved to a database or elsewhere
app.post('/lwr/metrics', async (req, res) => {
    const data = req.body;
    console.log('LWR Metrics: ', data, '\n'); // save data here
    res.status(200).send();
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
