import LightningStore from 'stores/lightningStore';

export default class Record extends LightningStore {
    _recordId = '';

    get recordId(): string {
        return this._recordId;
    }

    set recordId(value: string) {
        this._recordId = value;
        this.tryRetrieve();
    }

    _fields: Set<string> = new Set<string>();

    get fields(): string[] {
        return Array.from(this._fields.values());
    }

    set fields(fields: string[]) {
        fields.forEach((f) => this._fields.add(f));
        this.tryRetrieve();
    }

    data?: Readonly<globalThis.Record<string, any>>;

    loading = false;

    notifyUpdateAvailalble(): Promise<void> {
        // mimic server refresh
        return new Promise((resolve) => setTimeout(resolve, 1000));
    }

    private tryRetrieve(): void {
        if (this.recordId !== '' && this._fields.size > 0) {
            this.loading = true;

            // mimic trip to server to get data
            setTimeout(() => {
                this.data = {
                    Id: this._recordId,
                    Name: 'Joe',
                };
                this.loading = false;
            }, 1000);
        }
    }
}
