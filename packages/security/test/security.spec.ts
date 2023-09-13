describe('Base security header verification', () => {
    beforeEach(async () => {
        await browser.url('/'); // update to csp-disabled for csp-disabled test
    });

    it('Express middleware is running correctly', async () => {
        const title = await browser.getTitle();
        expect(title).toEqual('LWR App');

        const heading = await browser.shadowDeep$('h1');
        expect(await heading.getText()).toEqual('Security Headers');
    });

    it('Hashed inline scripts present', async () => {
        const expressResponse = await browser.shadowDeep$('tbody');
        expect(await expressResponse.getText()).toContain('sha256-');
    });
});

describe('CSP disabled application', () => {
    beforeEach(async () => {
        await browser.url('/csp-disabled');
    });

    it('Express middleware is running correctly', async () => {
        const title = await browser.getTitle();
        expect(title).toEqual('LWR App');

        const heading = await browser.shadowDeep$('h1');
        expect(await heading.getText()).toEqual('Security Headers');
    });

    it('No CSP header present', async () => {
        const expressResponse = await browser.shadowDeep$('tbody');
        expect(await expressResponse.getText()).not.toContain('content-security-policy');
    });
});

describe('Multiple default header options', () => {
    beforeEach(async () => {
        await browser.url('/multiple-options');
    });

    it('Express middleware is running correctly', async () => {
        const title = await browser.getTitle();
        expect(title).toEqual('LWR App');

        const heading = await browser.shadowDeep$('h1');
        expect(await heading.getText()).toEqual('Security Headers');
    });

    it('No referrerPolicy header present', async () => {
        const expressResponse = await browser.shadowDeep$('tbody');
        expect(await expressResponse.getText()).not.toContain('referrer-policy');
    });

    it('No xXSSProtection header present', async () => {
        const expressResponse = await browser.shadowDeep$('tbody');
        expect(await expressResponse.getText()).not.toContain('x-xss-protection');
    });
});

export {};
