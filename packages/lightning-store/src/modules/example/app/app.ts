import { LightningElement } from 'lwc';
import { registerStore } from 'stores/lightningStore';
import Cart from 'stores/cart';
import PageReference from 'stores/pageReference';
import RecordStore from 'modules/stores/record/record';

export default class LightningStoreApp extends LightningElement {
    // generated, or smart enough to consume metadata
    constructor() {
        super();
        registerStore('low-cart', new Cart());
        registerStore('mid-cart', new Cart());
        registerStore('foo', new PageReference());

        let recordStore = new RecordStore();
        recordStore.recordId = '123'; // eg from url
        // recordStore.recordId = /* parse url */

        // TODO - recordStore would do this itself
        // recordStore.data = { foo: 'bar' };

        registerStore('r1', recordStore);

        recordStore = new RecordStore();
        recordStore.recordId = '456'; // eg from url
        // recordStore.data = { foo: 'baz' };

        registerStore('r2', recordStore);

        // metadata

        // how do builders walk the component tree?
        // how do we map components in metadata to components/elements at runtime?

        // component metadata
        //    example-A
        //       stores:
        //          foo: PageReference
        //          default-record: RecordStore

        // page metadata
        //    <app>
        //       policy: LCP
        //       foo: PageReference
        //       r1: RecordStore for record 1
        //       r2: RecordStore for record 2
        //       <example-A>
        //          priority: high
        //          default-record: r1
        //              fields: [...]
        //       <example-A>
        //          priority: default from app policy (eg size based, ...)
        //          default-record: r2
    }

    renderedCallback(): void {
        // find example-A 1, set default-record => r1 mapping on it
    }
}
