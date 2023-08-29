import { existsSync } from 'fs';
import { createServer } from 'lwr';
import express from 'express';
import fs from 'fs';
import type { Services } from '@wdio/types';

// Use the same environment variable(s) as LWR does to initialize
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
// default to running headless, but allow an override to be headed
const debug = process.env.DEBUG;
const NOHEADLESS = process.env.NOHEADLESS || process.env.DEBUG;
const CHROME_ARGS = ['--verbose'].concat(NOHEADLESS ? [] : ['--headless', '--disable-gpu']);
if (existsSync('/.dockerenv')) {
    CHROME_ARGS.push('--no-sandbox');
}

class LWRServiceLauncher implements Services.ServiceInstance {
    async onPrepare(): Promise<void> {
        const port = PORT;
        const server = createServer({ port, serverType: 'express' });
        const internalServer = server.getInternalServer<'express'>();
        const dir = 'site';
        // Allow the test to be run against prebuilt LWR static content
        if (fs.existsSync(dir)) {
            console.log('Using prebuilt content from directory: ' + dir);
            internalServer.use(express.static(dir));
        }
        await server.listen(({ port, serverMode }) => {
            console.log(`[LWR Service] App listening on port ${port} in ${serverMode} mode\n`);
        });
    }
}

export const config: WebdriverIO.Config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    // WebdriverIO supports running e2e tests as well as unit and component tests.
    runner: 'local',
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            transpileOnly: true,
            project: './tsconfig.json',
        },
    },
    //
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called.
    //
    // The specs are defined as an array of spec files (optionally using wildcards
    // that will be expanded). The test for each spec file will be run in a separate
    // worker process. In order to have a group of spec files run in the same worker
    // process simply enclose them in an array within the specs array.
    //
    // If you are calling `wdio` from an NPM script (see https://docs.npmjs.com/cli/run-script),
    // then the current working directory is where your `package.json` resides, so `wdio`
    // will be called from there.
    //
    specs: ['./test/**/*.ts'],
    // Patterns to exclude.
    exclude: [
        // Exclude utam tests until working again
        './test/__utam__/*.ts',
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: 1,
    capabilities: [
        {
            maxInstances: 1,
            browserName: 'chrome',
            browserVersion: 'stable',
            'goog:chromeOptions': {
                args: CHROME_ARGS,
            },
        },
    ],
    execArgv: debug ? ['--inspect']: [],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'trace',
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner, @wdio/lambda-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/applitools-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    baseUrl: `http://localhost:${PORT}`,
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 20 * 1000,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    framework: 'mocha',
    mochaOpts: {
        timeout: 30 * 1000,
    },
    services: [
        [LWRServiceLauncher, {}],
    ],
    before(caps, spec: string[], browser: WebdriverIO.Browser): void {
        browser.addCommand('shadowDeep$', async (selector: string) => {
            return browser.$('>>>' + selector);
        });

        browser.addCommand('shadowDeep$$', async (selector: string) => {
            return browser.$$('>>>' + selector);
        });

        browser.addCommand('waitForElement', async (selector: string) => {
            return browser.waitUntil(
                async () => {
                    const element = await browser.shadowDeep$(selector);

                    if (!(await element.isExisting())) {
                        return undefined;
                    }

                    return element;
                },
                {
                    timeoutMsg: `'${selector}' did not become available before the timeout`,
                },
            );
        });
    },
};
