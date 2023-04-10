import App from 'module-provider/pageObjects/app';

describe('app navbar navigation', () => {
    beforeEach(async () => {
        await browser.url('/');
    });

    it('Home page loads correctly', async () => {
        const app: App = await utam.load(App);
        expect(await app.isPresent()).toBe(true);

        // Check the page heading
        const heading = await app.getHeading();
        expect(await heading.isVisible()).toBe(true);
        expect(await heading.getText()).toBe('Custom Module Providers');

        // Check the module headings
        const esHeading = await app.getEsProviderHeading();
        expect(await esHeading.isVisible()).toBe(true);
        expect(await esHeading.getText()).toBe('ES Module Provider');
        const lwcHeading = await app.getLwcProviderHeading();
        expect(await lwcHeading.isVisible()).toBe(true);
        expect(await lwcHeading.getText()).toBe('LWC Module Provider');
    });

    it('ES Module Provider - Echoes correct messages', async () => {
        const app: App = await utam.load(App);
        expect(await app.isPresent()).toBe(true);

        // Check input clicks work as expected
        const lwrInput = await app.getLwrButton();
        await lwrInput.click();
        const lwrEcho = await app.getEchoMessage();
        expect(await lwrEcho.getText()).toEqual('LWR');

        const helloInput = await app.getHelloButton();
        await helloInput.click();
        const helloEcho = await app.getEchoMessage();
        expect(await helloEcho.getText()).toEqual('Hello World!');
    });

    it('LWC Module Provider - Displays correct colors', async () => {
        const app: App = await utam.load(App);
        expect(await app.isPresent()).toBe(true);

        // Check input clicks work as expected
        const purpleButton = await app.getPurpleButton();
        await purpleButton.click();
        const purpleCircle = await app.getPurpleCircle();
        expect(await purpleCircle.isPresent()).toBe(true);

        const navyButton = await app.getNavyButton();
        await navyButton.click();
        const navyCircle = await app.getNavyCircle();
        expect(await navyCircle.isPresent()).toBe(true);

        const maroonButton = await app.getMaroonButton();
        await maroonButton.click();
        const maroonCircle = await app.getMaroonCircle();
        expect(await maroonCircle.isPresent()).toBe(true);
    });
});
