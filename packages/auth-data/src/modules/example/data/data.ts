import { LightningElement } from 'lwc';

// UI API interfaces for records
interface Field {
    value: string;
    displayValue: string;
}
export interface OrgRecord {
    id: string;
    fields: Record<string, Field>;
}
interface RecordData {
    count: number;
    nextPageToken: number | null;
    previousPageToken: number | null;
    records: OrgRecord[];
}
export interface RecordPayload {
    records: RecordData;
}
export interface RecordError {
    body: { message: string };
    ok: boolean;
    status: number;
    statusText: string;
}

export default class ExampleData extends LightningElement {
    // Toggle chart vs table view
    isTable = false;
    toggleDisplay(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        this.isTable = checkbox.checked;
        this.showSidebar = false;
    }

    // Handle list view
    listView = 'AllOpportunities';
    listViews = [
        { label: 'All', value: 'AllOpportunities' },
        { label: 'Mine', value: 'MyOpportunities' },
        { label: 'Recent', value: 'RecentlyViewedOpportunities' },
        { label: 'Closing this month', value: 'ClosingThisMonth' },
        { label: 'Closing next month', value: 'ClosingNextMonth' },
    ];
    toggleListView(event: Event): void {
        const select = event.target as HTMLSelectElement;
        this.listView = select.value;
    }

    // Handle field which shows in the chart x-axis
    field = 'StageName';
    fields = [
        { label: 'Stage', value: 'StageName' },
        { label: 'Account', value: 'Account' },
    ];
    toggleField(event: Event): void {
        const select = event.target as HTMLSelectElement;
        this.field = select.value;
        this.showSidebar = false;
    }
    get fieldDropdownStyles(): string {
        // The field dropdown is only relevant to the chart
        return this.isTable ? 'display:none' : '';
    }

    // Sidebar
    showSidebar = false;
    fieldValue = ''; // sidebar shows opportunities by field value (e.g. "Closed Won")
    get leftClass(): string {
        return this.showSidebar ? '' : 'full';
    }
    openSidebar(e: CustomEvent): void {
        // Event sent by the "example/dataChart" when a bar is clicked
        this.fieldValue = e.detail;
        this.showSidebar = true;
    }
    closeSidebar(): void {
        this.showSidebar = false;
    }
}
