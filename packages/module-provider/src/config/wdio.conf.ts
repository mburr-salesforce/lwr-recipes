/* eslint-disable @typescript-eslint/no-explicit-any */
import { Capabilities } from '@wdio/types';
import LWRService from '../services/lwr-service';
import { existsSync } from 'fs';
import { UtamWdioService } from 'wdio-utam-service';

const NOHEADLESS = process.env.NOHEADLESS;
// Use the same environment variable(s) as LWR does to initialize
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
// default to running headless, but allow an override to be headed
const CHROME_ARGS = ['--verbose'].concat(NOHEADLESS ? [] : ['--headless']);
if (existsSync('/.dockerenv')) {
    CHROME_ARGS.push('--no-sandbox');
}

export const config = {
    logLevel: 'warn',

    framework: 'mocha',

    waitforTimeout: 20 * 1000,

    connectionRetryTimeout: 120 * 1000,
    connectionRetryCount: 3,

    mochaOpts: {
        timeout: 30 * 1000,
    },

    baseUrl: `http://localhost:${PORT}`,

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

    services: [
        ['chromedriver', { port: 8015 }],
        [UtamWdioService, {}],
        [
            LWRService,
            {
                config: {
                    rootDir: './',
                    port: 8080,
                    serverMode: 'prod',
                },
            },
        ],
    ],

    specs: ['./src/tests/module-provider.spec.ts'],

    before(caps: Capabilities.W3CCapabilities, spec: string[], browser: WebdriverIO.Browser): void {
        browser.addCommand('shadowDeep$', async (selector: string) => {
            return browser.$('>>>' + selector);
        });

        browser.addCommand('shadowDeep$$', async (selector: string) => {
            return browser.$$('>>>' + selector);
        });

        browser.addCommand('waitForElement', async (selector: string) => {
            return browser.waitUntil(
                async (): Promise<any> => {
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
