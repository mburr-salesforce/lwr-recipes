import App from 'simple-routing/pageObjects/app';
import Home from 'simple-routing/pageObjects/home';
import Outlet from '@lwrjs/router/pageObjects/outlet';
import Products from 'simple-routing/pageObjects/products';

describe('app navbar navigation', () => {
    beforeEach(async () => {
        await browser.url('/');

        // wait for page to load
        await browser.waitForElement('h1');
    });

    it('lands on the home page', async () => {
        const app: App = await utam.load(App);
        expect(await app.isPresent()).toBe(true);

        const outlet: Outlet = await app.getOutlet();
        expect(await outlet.isPresent()).toBe(true);

        const homePage: Home = await outlet.getContent(Home);
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
        const app: App = await utam.load(App);
        expect(await app.isPresent()).toBe(true);

        const outlet: Outlet = await app.getOutlet();
        expect(await outlet.isPresent()).toBe(true);

        const homePage: Home = await outlet.getContent(Home);
        expect(await homePage.isVisible()).toBe(true);

        const productsLink = await homePage.getProductsLink();
        await productsLink.click();
        await browser.waitForElement('.products');

        const productsPage: Products = await outlet.getContent(Products);
        const productHeading = await productsPage.getHeading();
        expect(await productHeading.isVisible()).toBe(true);
        expect(await productHeading.getText()).toBe('Our Products');
    });
});
