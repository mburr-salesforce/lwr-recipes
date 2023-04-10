declare namespace WebdriverIO {
    interface Browser {
        shadowDeep$: (selector: string) => Promise<WebdriverIO.Element>;
        shadowDeep$$: (selector: string) => Promise<WebdriverIO.Element[]>;
        waitForElement: (selector: string) => Promise<WebdriverIO.Element>;
    }
}
