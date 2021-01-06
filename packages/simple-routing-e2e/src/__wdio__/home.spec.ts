import App from 'simple-routing/pageObjects/app';

describe('app navbar navigation', () => {
    it('landing page', async () => {
        await browser.url('/');
        browser.debug();

        const appPO = await utam.load(App);
        expect(appPO).toBeDefined();

        const outlet = await appPO.getOutlet();
        expect(outlet).toBeDefined();

        const homePage = await outlet.getContent();
        expect(homePage).toBeDefined();
        expect(await homePage.isDisplayed()).toBe(true);

        // TODO: How to inspect generic page content?
        /*
        const heading = await homePage.getHeading();
        expect(await heading.isDisplayed()).toBe(true);
        expect(await heading.getText()).toBe('Welcome!')
        */
    });
});
