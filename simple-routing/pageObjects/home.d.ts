import { By as _By, UtamBasePageObject as _UtamBasePageObject, ActionableUtamElement as _ActionableUtamElement, UnknownUtamElement as _UnknownUtamElement, WebDriver as _WebDriver, WebElement as _WebElement, Locator as _Locator } from '@utam/core';
export default class Home extends _UtamBasePageObject {
    constructor(driver: _WebDriver, element?: _WebElement, locator?: _Locator);
    getHeadingElement(): Promise<_ActionableUtamElement>;
    getDescriptionElement(): Promise<_UnknownUtamElement>;
}