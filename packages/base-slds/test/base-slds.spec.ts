describe('Base SLDS Testing', () => {
    beforeEach(async () => {
        await browser.url('/');
    });

    it('Loads the home page correctly', async () => {
        const title = await browser.getTitle();
        expect(title).toEqual('LWR + SLDS Example');

        const lightningTabset = await browser.shadowDeep$('lightning-tabset');
        expect(await lightningTabset.isExisting()).toBeTruthy();
    });

    it('Can load Button tab', async () => {
        const buttonsLink = await browser.shadowDeep$('a[data-tab-value="buttons"]');
        expect(await buttonsLink.isClickable()).toBeTruthy();
        await buttonsLink.click();
        const buttonsLightningTab = await browser.shadowDeep$('example-buttons');
        expect(buttonsLightningTab).toBeDisplayed();
    });

    it('Can load Navigation tab', async () => {
        const navsLink = await browser.shadowDeep$('a[data-tab-value="nav"]');
        expect(await navsLink.isClickable()).toBeTruthy();
        await navsLink.click();
        const navsLightningTab = await browser.shadowDeep$('example-nav');
        expect(navsLightningTab).toBeDisplayed();
    });

    it('Can load Cards tab', async () => {
        const cardsLink = await browser.shadowDeep$('a[data-tab-value="cards"]');
        expect(await cardsLink.isClickable()).toBeTruthy();
        await cardsLink.click();
        const cardsLightningTab = await browser.shadowDeep$('example-cards');
        expect(cardsLightningTab).toBeDisplayed();
    });

    it('Can load Data tab', async () => {
        const dataLink = await browser.shadowDeep$('a[data-tab-value="data"]');
        expect(await dataLink.isClickable()).toBeTruthy();
        await dataLink.click();
        const dataLightningTab = await browser.shadowDeep$('example-data');
        expect(dataLightningTab).toBeDisplayed();
    });

    it('Can load Modals tab', async () => {
        const modalsLink = await browser.shadowDeep$('a[data-tab-value="modals"]');
        expect(await modalsLink.isClickable()).toBeTruthy();
        await modalsLink.click();
        const modalLightningTab = await browser.shadowDeep$('example-modals');
        expect(modalLightningTab).toBeDisplayed();
    });
});

export default {};
