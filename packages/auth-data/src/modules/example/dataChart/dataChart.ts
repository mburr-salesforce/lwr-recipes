import { LightningElement, api, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import type { ShadowRootTheGoodPart } from 'lwc';
import type { OrgRecord, RecordError, RecordPayload } from 'example/data';

// Chart.js interfaces
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Chart: any;
    }
}
interface ChartData {
    labels: string[];
    datasets: {
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
        data: number[];
    }[];
}
interface ChartElement {
    index: number;
}
interface Chart extends Element {
    ctx: CanvasRenderingContext2D;
    data: ChartData;
    update: () => void;
    getElementsAtEventForMode: (
        e: Event,
        mode: string,
        options: unknown,
        useFinalPosition: boolean,
    ) => ChartElement[];
}

export default class ExampleDataChart extends LightningElement {
    @api listView = 'AllOpportunities';
    records: OrgRecord[] = [];
    loading = true;
    showLogin = false;
    errorMsg?: string;

    @wire(getListUi, {
        objectApiName: 'Opportunity',
        listViewApiName: '$listView',
    })
    getRecords({ error, data }: { error: RecordError; data: RecordPayload }): void {
        if (data) {
            this.records = data.records.records;
            this.loading = false;
            // Redraw the chart when the list of records changes
            this.drawChart();
        } else if (error) {
            if (error.status === 401) {
                this.showLogin = true;
            }
            this.errorMsg = `Data chart failed to fetch records. ${error.body.message}`;
            this.loading = false;
        }
    }

    // Update the field used on the chart's x axis
    _field = 'StageName';
    @api get field(): string {
        return this._field;
    }
    set field(value: string) {
        this._field = value;
        this.drawChart();
    }

    // Chart and canvas
    rendered = false;
    renderedCallback(): void {
        this.rendered = true;
    }
    _chart: Chart | undefined;
    _canvas: HTMLCanvasElement | undefined;
    get canvas(): HTMLCanvasElement {
        // The chart must be manually placed in the DOM
        if (!this._canvas) {
            this._canvas = document.createElement('canvas');
            const canvasContainer = (this.template as ShadowRootTheGoodPart).querySelector('div.canvas');
            if (canvasContainer) {
                canvasContainer.appendChild(this._canvas);
            }
        }
        return this._canvas;
    }
    backgroundcolor = [
        'rgba(63, 15, 64, 0.3)', // purple
        'rgba(53, 196, 239, 0.3)', // light blue
        'rgba(237, 178, 46, 0.3)', // yellow
        'rgba(46, 181, 124, 0.3)', // green
        'rgba(225, 29, 89, 0.3)', // pink
        'rgba(18, 100, 163, 0.3)', // dark blue
        'rgba(63, 15, 64, 0.3)', // purple
        'rgba(53, 196, 239, 0.3)', // light blue
        'rgba(237, 178, 46, 0.3)', // yellow
        'rgba(46, 181, 124, 0.3)', // green
        'rgba(225, 29, 89, 0.3)', // pink
        'rgba(18, 100, 163, 0.3)', // dark blue
    ];
    get bordercolor(): string[] {
        // Border is an opaque version of the background fill color
        return this.backgroundcolor.map((color) => color.replace('0.3', '1'));
    }
    get chartData(): ChartData {
        // Chart.js options
        return {
            labels: this.dataLabels,
            datasets: [
                {
                    backgroundColor: this.backgroundcolor,
                    borderColor: this.bordercolor,
                    borderWidth: 2,
                    data: this.dataAmounts,
                },
            ],
        };
    }
    drawChart(): void {
        if (this.rendered) {
            try {
                if (!this._chart || !this._chart.ctx) {
                    this._chart = new window.Chart(this.canvas.getContext('2d'), {
                        type: 'bar',
                        data: this.chartData,
                        options: {
                            scales: { y: { type: 'linear', min: 0, ticks: { stepSize: 1 } } },
                            plugins: { legend: { display: false, labels: { boxHeight: 0 } } },
                        },
                    });
                    this.canvas.addEventListener('click', this.barClickHandler.bind(this));
                } else {
                    const newData = this.chartData;
                    this._chart.data.labels = newData.labels;
                    this._chart.data.datasets[0].data = newData.datasets[0].data;
                    this._chart.update();
                }
            } catch (error) {
                console.error('Error drawing chart:', error);
            }
        }
    }

    // Record data manipulation
    get dataLabels(): string[] {
        return Array.from(this.chartRecords.keys());
    }
    get dataAmounts(): number[] {
        return Array.from(this.chartRecords.values());
    }
    get chartRecords(): Map<string, number> {
        // Get dataset.data for the chart from the records
        let data: Map<string, number> =
            // Put stage names into the correct pipeline order
            this.field === 'StageName'
                ? new Map([
                      ['Prospecting', 0],
                      ['Needs Analysis', 0],
                      ['Proposal/Price Quote', 0],
                      ['Negotiation/Review', 0],
                      ['Closed Won', 0],
                      ['Closed Lost', 0],
                  ])
                : new Map();
        // Sum up the number of Opportunities for each field value
        this.records.forEach((r) => {
            const key = r.fields[this.field].displayValue;
            if (data.has(key)) {
                data.set(key, (data.get(key) as number) + 1);
            } else {
                data.set(key, 1);
            }
        });
        // Alphabetize values from the Account field
        if (this.field === 'Account') {
            data = new Map([...data.entries()].sort());
        }
        return data;
    }

    // Sidebar data table handling
    barClickHandler(event: Event): void {
        // Open a data table for all the records with the given field value
        const index = (this._chart as Chart).getElementsAtEventForMode(
            event,
            'nearest',
            { intersect: true },
            false,
        )[0]?.index;
        if (index >= 0) {
            // Notify "example/data" that a chart bar has been clicked
            // The "detail" is the field value (e.g. "Closed Won")
            this.dispatchEvent(new CustomEvent('barclick', { detail: this.dataLabels[index] }));
        }
    }
}
