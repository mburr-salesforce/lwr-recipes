import { LightningElement, api, track, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import type { OrgRecord, RecordError, RecordPayload } from 'example/data';

const ALL_FIELDS = ['Name', 'Account', 'Amount', 'StageName', 'CloseDate'];

export default class SampleDataTable extends LightningElement {
    records: OrgRecord[] = [];
    @track recordId: string | undefined;
    @api listView = 'AllOpportunities';
    @api field: string | undefined;
    @api fieldValue: string | undefined;
    @api editable = false;
    loading = true;
    errorMsg?: string;

    @wire(getListUi, {
        objectApiName: 'Opportunity',
        listViewApiName: '$listView',
    })
    getRecords({ error, data }: { error: RecordError; data: RecordPayload }): void {
        if (data) {
            this.records = data.records.records;
            this.loading = false;
            // Close the mini record view when the table data changes
            this.recordId = undefined;
        } else if (error) {
            this.errorMsg = `Data table failed to fetch records. ${error.body.message}`;
            this.loading = false;
        }
    }

    // Template variables
    get hasResults(): boolean {
        return !!this.recordFields.length;
    }
    get noResults(): boolean {
        return !this.loading && !this.recordFields.length && !this.errorMsg;
    }
    get tdStyles(): string {
        return this.editable ? 'cursor: pointer;' : '';
    }

    // Data manipulation
    pascalToSentence(str = ''): string {
        return str.replace(/([A-Z])/g, ' $1');
    }
    get tableTitle(): string | undefined {
        return this.field
            ? `${this.pascalToSentence(this.field)}: ${this.pascalToSentence(this.fieldValue)}`
            : undefined;
    }
    get fields(): string[] {
        // Filter the column for the currently selected field out of the table
        // The field is the "tableTitle"
        return ALL_FIELDS.filter((f) => f !== this.field);
    }
    get fieldLabels(): string[] {
        // Add spaces between words in field labels, e.g. "StageName" -> "Stage Name"
        return this.fields.map((f) => this.pascalToSentence(f));
    }
    get recordFields(): { id: string; values: { value: string; share: boolean }[] }[] {
        return (
            this.records
                // Filter the records down to ONLY those with the current field value
                // e.g. only show records where StageName/field = Prospecting/fieldValue
                .filter((r) => (this.field ? r.fields[this.field].displayValue === this.fieldValue : true))
                // For each record, create an array of field values
                // Each array is a row in the table
                .map((r) => ({
                    id: r.id,
                    name: r.fields.Name.value,
                    values: this.fields.map((f) => ({
                        value: r.fields[f].displayValue || r.fields[f].value,
                        share: f === 'Name',
                    })),
                }))
                // Sort alphabetically by the first column of values
                .sort((a, b) => (a.values[0] > b.values[0] ? 1 : -1))
        );
    }

    // Open the given record for editing in the "example/dataRecord" component
    get canEditRecord(): boolean {
        return this.editable && !!this.recordId;
    }
    editRecord(e: Event): void {
        const recordId = (e.target as HTMLTableCellElement).dataset.recordId;
        if (this.editable && recordId) {
            this.recordId = recordId;
        }
    }
}
