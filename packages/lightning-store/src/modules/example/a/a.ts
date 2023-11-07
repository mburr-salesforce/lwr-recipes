import { track, LightningElement } from 'lwc';
import { addStoreMapping, useStore } from 'stores/lightningStore';
import type PageReference from 'stores/pageReference';
import type RecordStore from 'modules/stores/record/record';

let firstA = true;

export default class A extends LightningElement {
    pageRef: PageReference;
    @track
    record: RecordStore | undefined;

    /*
    @store<RecordStore>('default-record', 'data')
    recordData;

    @store('default-record')
    useRecordStore(recordStore) {
        this.recordStore = recordStore;
        // recordStore.recordId = '123';
        // recordStore.fields = [...]
    }

    set recordStore(rs) {
        this.recordStore = rs;
    }
*/
    constructor() {
        super();

        addStoreMapping(this, 'default-record', firstA ? 'r1' : 'r2');
        firstA = false;

        // middle of the road
        this.pageRef = useStore<PageReference>(this, 'foo') as PageReference;
        this.record = useStore<RecordStore>(this, 'default-record') as RecordStore;

        // extreme pro code
        // this.pageRef = new PageReference();

        // LWC data binding should do this
        setTimeout(() => {
            this.record = undefined;
            this.record = useStore<RecordStore>(this, 'default-record') as RecordStore;
        }, 6000);
    }

    get foo(): string {
        return this.record?.data?.foo || '(no data yet)';
    }
}
