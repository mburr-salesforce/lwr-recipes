/* eslint no-unused-vars: 0 */
const fs = require('fs');
const path = require('path');
const simpleRoutingApp = require('simple-routing');

const { UtamWdioService } = require('wdio-utam-service');
const { reject } = require('any-promise');
const NOHEADLESS = process.env.NOHEADLESS;

// override default timeout for debug mode
const DEFAULT_TIMEOUT = 20000; // 1000 * 60 * 30;

// Use the same environment variable(s) as LWR does to initialize
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
// default to running headless, but allow an override to be headed
const CHROME_ARGS = ['--verbose'].concat(NOHEADLESS ? [] : ['--headless']);
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

    onComplete(ec, config, capabilities, results) {
        if (results.passed === 0 && results.failed === 0) {
            throw new Error(
                'No tests were ran because they were all skipped. This is likely a WDIO configuration issue. Results: ' +
                    JSON.stringify(results),
            );
        }
    },

    before: function () {
        require('./helpers/jasmine')();
    },
};
