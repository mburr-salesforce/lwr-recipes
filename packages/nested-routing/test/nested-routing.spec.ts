describe('Nested Routing', () => {
    beforeEach(async () => {
        await browser.url('/');
    });

    it('Loads the home page correctly', async () => {
        // check the title of the page
        const title = await browser.getTitle();
        expect(title).toEqual('LWR App');

        // check the page heading
        const heading = await browser.shadowDeep$('h1');
        expect(await heading.getText()).toEqual('Home');
        const subtext = await browser.shadowDeep$('p');
        expect(await subtext.getText()).toEqual(
            'This example shows how to route to different pages using multiple nested routers.',
        );
    });

    it('Verify nested routing navigation', async () => {
        // Find the animal nav item
        const animalsLink = await browser.shadowDeep$('a[href="/animal"]');
        expect(await animalsLink.getText()).toEqual('Animals');
        expect(await browser.getUrl()).toEqual('http://localhost:8080/');

        // Click the animal nav item
        await browser.execute('arguments[0].click();', animalsLink);
        expect(await browser.getUrl()).toEqual('http://localhost:8080/animal');

        // Verify the dog link is displayed
        const dogLink = await browser.shadowDeep$('a[href="/animal/dog"]');
        await dogLink.waitForDisplayed();

        // Click the dog link
        await browser.execute('arguments[0].click();', dogLink);
        expect(await browser.getUrl()).toEqual('http://localhost:8080/animal/dog');

        // Verify dog picture is displayed
        const dogPic = await browser.shadowDeep$('img[src="/public/assets/dog.jpeg"]');
        await dogPic.waitForDisplayed();

        // Verify the cat link is displayed
        const catLink = await browser.shadowDeep$('a[href="/animal/cat"]');
        await catLink.waitForDisplayed();

        // Click the cat link
        await browser.execute('arguments[0].click();', catLink);
        expect(await browser.getUrl()).toEqual('http://localhost:8080/animal/cat');

        // Verify cat picture is displayed
        const catPic = await browser.shadowDeep$('img[src="/public/assets/cat.jpeg"]');
        await catPic.waitForDisplayed();
    });
});

export default {};
