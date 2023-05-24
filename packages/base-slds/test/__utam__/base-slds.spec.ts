import App from 'base-slds/pageObjects/app';
import Home from 'base-slds/pageObjects/homePage';

import Tabset from '../../../../node_modules/salesforce-pageobjects/dist/lightning/pageObjects/tabset';
import Tabbar from '../../../../node_modules/salesforce-pageobjects/dist/lightning/pageObjects/tabBar';

describe('Base SLDS Recipe', () => {
    beforeEach(async () => {
        await browser.url('/');
    });
    it('loads home page', async () => {
        const home: Home = await utam.load(Home);
        expect(await home.isPresent()).toBe(true);

        const app: App = await home.getApp();
        expect(await app.isPresent()).toBe(true);

        const tabSet: Tabset = await app.getLightningTabset();
        expect(await tabSet.isPresent()).toBe(true);
    });

    it('Can load card tab', async () => {
        const home: Home = await utam.load(Home);
        expect(await home.isPresent()).toBe(true);

        const app: App = await home.getApp();
        expect(await app.isPresent()).toBe(true);

        const tabSet: Tabset = await app.getLightningTabset();
        expect(await tabSet.isPresent()).toBe(true);

        const tabBar: Tabbar = await tabSet.getTabBar();
        await tabBar.clickTab('Cards');

        const cards = await app.getExampleCards();
        expect(await cards.isPresent()).toBe(true);
    });

    it('Can load nav tab', async () => {
        const home: Home = await utam.load(Home);
        expect(await home.isPresent()).toBe(true);

        const app: App = await home.getApp();
        expect(await app.isPresent()).toBe(true);

        const tabSet: Tabset = await app.getLightningTabset();
        expect(await tabSet.isPresent()).toBe(true);

        const tabBar: Tabbar = await tabSet.getTabBar();
        await tabBar.clickTab('Nav');

        const nav = await app.getExampleNav();
        expect(await nav.isPresent()).toBe(true);
    });

    it('Can load data tab', async () => {
        const home: Home = await utam.load(Home);
        expect(await home.isPresent()).toBe(true);

        const app: App = await home.getApp();
        expect(await app.isPresent()).toBe(true);

        const tabSet: Tabset = await app.getLightningTabset();
        expect(await tabSet.isPresent()).toBe(true);

        const tabBar: Tabbar = await tabSet.getTabBar();
        await tabBar.clickTab('Data');

        const data = await app.getExampleData();
        expect(await data.isPresent()).toBe(true);
    });

    it('Can load modals tab', async () => {
        const home: Home = await utam.load(Home);
        expect(await home.isPresent()).toBe(true);

        const app: App = await home.getApp();
        expect(await app.isPresent()).toBe(true);

        const tabSet: Tabset = await app.getLightningTabset();
        expect(await tabSet.isPresent()).toBe(true);

        const tabBar: Tabbar = await tabSet.getTabBar();
        await tabBar.clickTab('Modals');

        const modals = await app.getExampleModals();
        expect(await modals.isPresent()).toBe(true);
    });

    it('Can load buttons tab', async () => {
        const home: Home = await utam.load(Home);
        expect(await home.isPresent()).toBe(true);

        const app: App = await home.getApp();
        expect(await app.isPresent()).toBe(true);

        const tabSet: Tabset = await app.getLightningTabset();
        expect(await tabSet.isPresent()).toBe(true);

        const tabBar: Tabbar = await tabSet.getTabBar();
        await tabBar.clickTab('Buttons');

        const buttons = await app.getExampleButtons();
        expect(await buttons.isPresent()).toBe(true);
    });
});
