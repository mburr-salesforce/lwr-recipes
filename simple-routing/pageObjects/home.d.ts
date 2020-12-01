import { By as _By, UtamBasePageObject as _UtamBasePageObject, ActionableUtamElement as _ActionableUtamElement, Driver as _Driver, Element as _Element, Locator as _Locator } from '@utam/core';
export default class Home extends _UtamBasePageObject {
    constructor(driver: _Driver, element?: _Element, locator?: _Locator);
    getHeading(): Promise<_ActionableUtamElement>;
    getDescription(): Promise<_ActionableUtamElement>;
}