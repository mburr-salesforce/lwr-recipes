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
});
