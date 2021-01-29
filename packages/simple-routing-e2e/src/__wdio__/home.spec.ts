import App from 'simple-routing/pageObjects/app';
import Outlet from 'simple-routing/pageObjects/outlet';
import { ActionableUtamElement } from '@utam/core';

describe('app navbar navigation', () => {
    it('landing page', async () => {
        await browser.url('/');
        browser.debug();

        const appPO: App = await utam.load(App);
        expect(appPO).toBeDefined();

        const outlet: Outlet = await appPO.getOutlet();
        expect(outlet).toBeDefined();

        const homePage: ActionableUtamElement = await outlet.getContent();
        expect(homePage).toBeDefined();
        expect(await homePage.isVisible()).toBe(true);

        // TODO: How to inspect generic page content?
        /*
        const heading = await homePage.getHeading();
        expect(await heading.isDisplayed()).toBe(true);
        expect(await heading.getText()).toBe('Welcome!')
        */
    });
});
