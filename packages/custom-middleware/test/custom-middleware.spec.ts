describe('custom-middleware header verification', () => {
    beforeEach(async () => {
        await browser.url('/');
    });

    it('Express middleware is running correctly', async () => {
        const title = await browser.getTitle();
        expect(title).toEqual('LWR App');

        const heading = await browser.shadowDeep$('h1');
        expect(await heading.getText()).toEqual('Response Headers');

        const expressResponse = await browser.shadowDeep$('tbody');
        expect(await expressResponse.getText()).toContain('Express middleware is running!');
    });
});

export default {};
