/* eslint no-unused-vars: 0 */
const fs = require('fs');
const path = require('path');
const simpleRoutingApp = require('simple-routing');

const { UtamWdioService } = require('wdio-utam-service');
const { reject } = require('any-promise');
// const HEADLESS = process.env.HEADLESS;
// const DEBUG = process.env.DEBUG;

// const ChromeOptions = HEADLESS ? { args: ['--headless'] } : {};
// override default timeout for debug mode
const DEFAULT_TIMEOUT = 20000; // 1000 * 60 * 30;

// Use the same environment variable(s) as LWR does to initialize
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const CHROME_ARGS = ['--headless', '--verbose'];
if (fs.existsSync('/.dockerenv')) {
    CHROME_ARGS.push('--no-sandbox');
}

exports.config = {
    runner: 'local',
    specs: ['src/__wdio__/*.spec.ts'],
    maxInstances: 1,
    capabilities: [
        {
            maxInstances: 1,
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: CHROME_ARGS,
            },
        },
    ],
    logLevel: 'trace',
    bail: 0,
    baseUrl: `http://localhost:${PORT}`,
    // this sets timeout for all waitFor*
    waitforTimeout: DEFAULT_TIMEOUT,
    connectionRetryTimeout: DEFAULT_TIMEOUT,
    connectionRetryCount: 3,
    automationProtocol: 'devtools',
    services: [
        ['chromedriver', { port: 8015 }],
        [UtamWdioService, {}],
    ],
    framework: 'jasmine',
    jasmineNodeOpts: {
        helpers: [path.join(__dirname, 'helpers/jasmine.js')], // transpiles(es6 modules)
        requires: ['ts-node/register'], // tranpile ts
        expectationResultHandler: function (passed, assertion) {
            // noop
        },
        defaultTimeoutInterval: DEFAULT_TIMEOUT,
    },

    async onPrepare() {
        return new Promise((resolve) => {
            simpleRoutingApp({
                port: PORT,
                rootDir: '../simple-routing',
            })
                .then((app) => {
                    app.listen(({ port, serverMode }) => {
                        console.log(`SimpleRouting listening on port ${port} in ${serverMode} mode`);
                        resolve();
                    });
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                    // process.exit(1);
                });
        });
    },

    before: function () {
        require('ts-node').register({ files: true });
        require('./helpers/jasmine')();
    },
};
