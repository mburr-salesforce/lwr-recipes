describe('Module Provider', () => {
    beforeEach(async () => {
        await browser.url('/');
    });

    it('Loads the home page correctly', async () => {
        // check the title of the page
        const title = await browser.getTitle();
        expect(title).toEqual('LWR App');

        // check the page heading
        const heading = await browser.shadowDeep$('h1');
        expect(await heading.getText()).toEqual('Custom Module Providers');

        // Check the module headings
        const esHeading = await browser.shadowDeep$('.esProvider h2');
        expect(await esHeading.getText()).toEqual('ES Module Provider');
        const lwcHeading = await browser.shadowDeep$('.lwcProvider h2');
        expect(await lwcHeading.getText()).toEqual('LWC Module Provider');
    });

    it('ES Module Provider - Echoes correct messages', async () => {
        const lwrInput = await browser.shadowDeep$('#lwr');
        expect(lwrInput.isClickable()).toBeTruthy();
        await lwrInput.click();
        const echoMessage1 = await browser.shadowDeep$('#echo');
        expect(await echoMessage1.getText()).toEqual('LWR');

        const helloInput = await browser.shadowDeep$('#hello');
        expect(helloInput.isClickable()).toBeTruthy();
        await helloInput.click();
        const echoMessage2 = await browser.shadowDeep$('#echo');
        expect(await echoMessage2.getText()).toEqual('Hello World!');
    });

    it('LWC Module Provider - Displays correct colors', async () => {
        const purple = await browser.shadowDeep$('#purple');
        expect(purple.isClickable()).toBeTruthy();
        await purple.click();
        const purple_element = await $('<color-purple />');
        expect(purple_element).toBeDisplayed();

        const navy = await browser.shadowDeep$('#navy');
        expect(navy.isClickable()).toBeTruthy();
        await navy.click();
        const navy_element = await $('<color-navy />');
        expect(navy_element).toBeDisplayed();

        const maroon = await browser.shadowDeep$('#maroon');
        expect(maroon.isClickable()).toBeTruthy();
        await maroon.click();
        const maroon_element = await $('<color-maroon />');
        expect(maroon_element).toBeDisplayed();
    });
});
