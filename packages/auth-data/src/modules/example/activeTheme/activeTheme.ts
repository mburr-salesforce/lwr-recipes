import { LightningElement, wire } from 'lwc';
import { getActiveTheme } from 'luvio-next/uiapi';
import type { Theme } from 'luvio-next/uiapi';
import type { RecordError } from 'example/data';

export default class ExampleData extends LightningElement {
    themeData = '(loading)';

    @wire(getActiveTheme, {})
    getActiveTheme({ data, error }: { data: Theme | undefined; error: RecordError }): void {
        this.themeData = data ? JSON.stringify(data, null, 2) : error.toString();
    }
}
