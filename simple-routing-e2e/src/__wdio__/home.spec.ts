// pageObjects in this app are rooted in this package
// import Home from '../../../../../pageObjects/home';
// import Home from 'lwr-simple-routing/pageObjects/home';
import Home from 'lwr-simple-routing/pageObjects/home';

describe('app navbar navigation', () => {
    it('landing page', async () => {
        await browser.url('http://localhost:8080');
        const homePage = await utam.load(Home, { locator: utam.By.css('example-home')});
        expect(homePage).toBeDefined();

        const heading = await homePage.getHeadingElement();
        // expect(await heading.isPresent()).toBe(true);
        expect(await heading.isDisplayed()).toBe(true);
        expect(await heading.getText()).toBe('Welcome!')
    });
});