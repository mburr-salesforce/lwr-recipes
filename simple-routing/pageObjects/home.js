import { By as _By, UtamBasePageObject as _UtamBasePageObject, ActionableUtamElement as _ActionableUtamElement, UnknownUtamElement as _UnknownUtamElement } from '@utam/core';

async function _utam_get_heading(driver, root) {
    let element = root;
    return element.findElement(_By.css(`h1`));
}

async function _utam_get_description(driver, root) {
    let element = root;
    return element.findElement(_By.css(`.text`));
}

export default class Home extends _UtamBasePageObject {
    constructor(driver, element, locator = _By.css('example-home')) {
        super(driver, element, locator);
    }

    async getHeadingElement() {
        const driver = this.driver;
        const root = await this.getRootElement();
        const element = await _utam_get_heading(driver, root, );
        return new _ActionableUtamElement(driver, element);
    }
    
    async getDescriptionElement() {
        const driver = this.driver;
        const root = await this.getRootElement();
        const element = await _utam_get_description(driver, root, );
        return new _UnknownUtamElement(driver, element);
    }
}