import App from 'simple-routing/pageObjects/app';
import Home from 'simple-routing/pageObjects/home';
import Outlet from '@lwrjs/router/pageObjects/outlet';
import Products from 'simple-routing/pageObjects/products';

// TODO Dumb workaround but wdio doesn't wait in our test cases for the app to load
// Need to talk with utam folks about this / figure out the proper configuration
// 5 seconds seems to work on CI - less is needed locally
const waitForAppLoadTimeout = process.env.UTAM_TIMEOUT ? parseInt(process.env.UTAM_TIMEOUT) : 5000;

describe('app navbar navigation', () => {
    it('lands on the home page', async () => {
        await browser.url('/');

        // TODO proper wait for app load
        await browser.pause(waitForAppLoadTimeout);

        const appPO: App = await utam.load(App);
        expect(appPO).toBeDefined();

        const outlet: Outlet = await appPO.getOutlet();
        expect(outlet).toBeDefined();

        const homePage: Home = await outlet.getContent(Home);
        expect(homePage).toBeDefined();
        expect(await homePage.isVisible()).toBe(true);

        const heading = await homePage.getHeading();
        expect(await heading.isVisible()).toBe(true);
        expect(await heading.getText()).toBe('Welcome!');

        const description = await homePage.getDescription();
        expect(await description.isVisible()).toBe(true);
        expect(await description.getText()).toContain(
            'The Lightning Web Runtime Farm is a sustainable family farm',
        );
    });

    it('navigates to the product list from the link in the home page', async () => {
        await browser.url('/');
        const baseUrl = await browser.getUrl();

        // TODO proper wait for app load
        await browser.pause(waitForAppLoadTimeout);

        let app: App = await utam.load(App);

        let outlet: Outlet = await app.getOutlet();
        const homePage: Home = await outlet.getContent(Home);
        expect(homePage).toBeDefined();
        expect(await homePage.isVisible()).toBe(true);

        homePage.linkToProducts();

        const productsUrl = baseUrl + 'products';
        await browser.waitUntil(async () => {
            const currentUrl = await browser.getUrl();
            console.log('URL is now', currentUrl);
            return currentUrl === productsUrl;
        });

        // Note: now that we've rendered a new page, every? PageObject references invalid elements, and cannot be used anymore, so we need to start loading everything again from scratch
        // TODO: how do we verify that the page did not completely reload, and it was a SPA pushState?
        app = await utam.load(App);
        outlet = await app.getOutlet();

        const productsPage: Products = await outlet.getContent(Products);
        const productHeading = await productsPage.getHeading();
        expect(await productHeading.isVisible()).toBe(true);
        expect(await productHeading.getText()).toBe('Our Products');
    });
});
