import Home from 'lwr-simple-routing/pageObjects/home';

describe('app navbar navigation', () => {
    test('landing page', async () => {
        await browser.url('http://localhost:8080');
        const homePage = await utam.load(Home, { locator: utam.By.css('example-home')});
        expect(homePage).toBeDefined();

        const heading = await homePage.getHeading();
        expect(await heading.isDisplayed()).toBe(true);
        expect(await heading.getText()).toBe('Welcome!')
    });
});