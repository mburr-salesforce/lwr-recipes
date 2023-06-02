describe('app navbar navigation', () => {
    beforeEach(async () => {
        await browser.url('/');

        // wait for page to load
        await browser.waitForElement('h1');
    });

    it('lands on the home page', async () => {
        const title = await browser.getTitle();
        expect(title).toEqual('LWR App');

        // check the page heading
        const heading = await browser.shadowDeep$('h1');
        expect(await heading.getText()).toEqual('Welcome!');

        const description = await browser.shadowDeep$('.text');
        expect(await description.getText()).toContain(
            'The Lightning Web Runtime Farm is a sustainable family farm',
        );
    });

    it('Verify simple routing navigation', async () => {
        // Find the products nav item
        const productsLink = await browser.shadowDeep$('a[href="/products"]');
        await productsLink.waitForDisplayed();
        expect(await productsLink.getText()).toEqual('Products');

        // Click the products nav item
        await browser.execute('arguments[0].click();', productsLink);
        const productsHeading = await browser.shadowDeep$('h1[class="products"]');
        expect(await productsHeading.getText()).toEqual('Our Products');

        // Click the recipes nav item
        const recipesLink = await browser.shadowDeep$('a[href="/recipes"]');
        await recipesLink.waitForDisplayed();
        await browser.execute('arguments[0].click();', recipesLink);

        const recipesPic = await browser.shadowDeep$('img[src="/public/assets/cook.jpg"]');
        await recipesPic.waitForDisplayed();

        // Click the contact nav item
        const contactLink = await browser.shadowDeep$('a[href="/contact"]');
        await contactLink.waitForDisplayed();
        await browser.execute('arguments[0].click();', contactLink);
        const textArea = await browser.shadowDeep$('textarea');
        await textArea.waitForDisplayed();

        // Click the contact nav item
        const errorLink = await browser.shadowDeep$('a[href="/pageHasError"]');
        await errorLink.waitForDisplayed();
        await browser.execute('arguments[0].click();', errorLink);
        const errorButton = await browser.shadowDeep$('button');
        await errorButton.waitForDisplayed();
    });
});
