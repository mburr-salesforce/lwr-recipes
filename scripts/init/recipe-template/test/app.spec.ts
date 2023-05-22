describe('test your app', () => {
    it('App works correctly', async () => {
        await browser.url('/');

        // check the title of the page
        const title = await browser.getTitle();
        expect(title).toEqual('LWR App');
    });
});
