/* eslint-disable @typescript-eslint/no-explicit-any */
import { LightningElement, track, wire } from 'lwc';
import { CurrentRouteMetadata, ExtendedMetadata } from 'example/currentRouteMetadata';

export default class MetadataPageAttributeApplier extends LightningElement {
    @track routeMetadata = [] as any;

    /**
     * This method is invoked whenever the value of the current route metadata
     * changes.  Because it can't be easily iterated over in a generic way in
     * the template in its current form it is transformed into an array of key
     * value objects and stored in the routeMetadata property to make it easier
     * to use.
     * @param rm route metadata
     */
    @wire(CurrentRouteMetadata as any)
    wiredRouteMetadata(rm?: ExtendedMetadata): void {
        // first reset the routeMetadata value, otherwise it will keep accumulating
        // metadata
        this.routeMetadata = [];
        if (rm) {
            let key: keyof typeof rm;
            for (key in rm) {
                this.routeMetadata.push({ value: rm[key], key: key });
            }
        } else {
            console.log('no route metadata');
        }
    }
}
