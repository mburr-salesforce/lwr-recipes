import { LightningElement, api, track, wire } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import type { RecordError } from 'example/data';

// Get/update a single Opportunity record, given an ID
// https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_wire_adapters_record
// https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_update_record

// Opportunity interfaces
interface Oppty {
    Id: { value: string };
    Name: { value: string };
    Amount: { value: string };
    StageName: { value: string };
    CloseDate: { value: string };
}
interface OpptyData {
    fields: Oppty;
}
interface Option {
    label?: string;
    value: string;
    selected?: boolean;
}
const STAGES: Option[] = [
    { value: 'Prospecting' },
    { value: 'Needs Analysis' },
    { value: 'Proposal/Price Quote' },
    { value: 'Negotiation/Review' },
    { value: 'Closed Won' },
    { value: 'Closed Lost' },
];

export default class ExampleDataRecord extends LightningElement {
    @api recordId: string | undefined;
    @track oppty: Oppty | undefined;
    @wire(getRecord, {
        recordId: '$recordId',
        fields: [
            'Opportunity.Id',
            'Opportunity.Name',
            'Opportunity.Amount',
            'Opportunity.StageName',
            'Opportunity.CloseDate',
        ],
    })
    getRecord({ error, data }: { error: RecordError; data: OpptyData }): void {
        if (data) {
            this.oppty = data.fields;
        } else if (error) {
            console.error(
                `Data record failed to fetch record with id "${this.recordId}". ${error.body.message}`,
            );
        }
    }

    // Record fields
    get theId(): string | undefined {
        return this.oppty?.Id.value;
    }
    get name(): string | undefined {
        return this.oppty?.Name.value;
    }
    get amount(): string | undefined {
        return this.oppty?.Amount.value;
    }
    get stage(): string | undefined {
        return this.oppty?.StageName.value;
    }
    get closeDate(): string | undefined {
        return this.oppty?.CloseDate.value;
    }

    // Form data
    buttonDisabled = true;
    enableButton(): void {
        this.buttonDisabled = false;
    }
    get stages(): Option[] {
        return STAGES.map((s) => ({ ...s, label: s.value, selected: s.value === this.stage }));
    }

    updateOppty(): void {
        updateRecord({
            fields: {
                Id: this.theId,
                Amount: (this.template.querySelector("input[name='Amount']") as HTMLInputElement).value,
                StageName: (this.template.querySelector("select[name='StageName']") as HTMLSelectElement)
                    .value,
                CloseDate: (this.template.querySelector("input[name='CloseDate']") as HTMLInputElement).value,
            },
        })
            .then(() => {
                this.buttonDisabled = true;
            })
            .catch((error: { body: { message: string } }) => {
                console.error(`Update failed: ${error.body.message}`);
            });
    }
}
