/* eslint no-unused-vars: 0 */
const path = require('path');
// const VanillaJs = require('vanilla-js-components');
const { UtamWdioService } = require('wdio-utam-service');
// const HEADLESS = process.env.HEADLESS;
// const DEBUG = process.env.DEBUG;

// const ChromeOptions = HEADLESS ? { args: ['--headless'] } : {};
// override default timeout for debug mode
const DEFAULT_TIMEOUT = 1000 * 60 * 30;

exports.config = {
    runner: 'local',
    specs: ['src/__wdio__/*.spec.ts'],
    maxInstances: 1,
    capabilities: [
        {
            maxInstances: 1,
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: ['--headless', '--verbose']
            }
        },
    ],
    logLevel: 'trace',
    bail: 0,
    baseUrl: 'http://localhost',
    // this sets timeout for all waitFor*
    waitforTimeout: 90000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    automationProtocol: 'devtools',
    services: [
        ['chromedriver', { port: 8015}],
        [UtamWdioService, {}]
    ],
    framework: 'jasmine',
    jasmineNodeOpts: {
        // defaultTimeoutInterval: 1000 * 60 * 30,
        helpers: [path.join(__dirname, 'helpers/jasmine.js')], // transpiles(es6 modules)
        requires: ['ts-node/register'], // tranpile ts
        expectationResultHandler: function (passed, assertion) {
            // noop
        },
        defaultTimeoutInterval: DEFAULT_TIMEOUT,
    },

    onPrepare() {
        // VanillaJs.createApp().listen(8080);
    },

    before: function () {
        require('ts-node').register({ files: true });
        require('./helpers/jasmine')();
    },
};
