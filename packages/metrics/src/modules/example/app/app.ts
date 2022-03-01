import { LightningElement } from 'lwc';
import {
    BOOTSTRAP_PREFIX,
    BOOTSTRAP_END,
    BOOTSTRAP_ERROR,
    LOADER_PREFIX,
    MAPPINGS_FETCH,
    MAPPINGS_ERROR,
    MODULE_DEFINE,
    MODULE_FETCH, // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    MODULE_ERROR, // @ts-ignore
} from 'lwr/metrics';

export default class MetricsApp extends LightningElement {
    bootstrapTime: number | boolean = false;
    bootstrapAvailability: number | boolean = false;
    loaderAvailability: number | boolean = false;
    loaderErrors = 0;
    definitions: { index: number; id: string }[] = [];
    modules: { index: number; id: string }[] = [];
    mappings: { index: number; id: string }[] = [];
    moduleCtor: unknown = undefined;

    constructor() {
        super();
        // Get the loader metrics which have already occurred
        // Then watch for further metrics from bootstrap and the loader
        this.getExistingLoaderMetrics();
        this.watchForMetrics();
    }

    getExistingLoaderMetrics(): void {
        if (globalThis.performance !== undefined) {
            // Gather all the loader marks so far
            const marks = globalThis.performance
                .getEntriesByType('mark')
                .filter((e) => e.name.startsWith(LOADER_PREFIX));

            // Recalculate loader metrics
            this.adjustLoaderMetrics(marks);
        }
    }

    watchForMetrics(): void {
        if (PerformanceObserver) {
            // Watch for new metrics
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                this.adjustBootstrapMetrics(entries);
                this.adjustLoaderMetrics(entries);
            });
            observer.observe({ entryTypes: ['mark'] });
        }
    }

    adjustLoaderMetrics(marks: PerformanceEntry[]): void {
        // Parse loader entries
        marks.forEach((e) => {
            const name = e.name;

            if (name.startsWith(MODULE_DEFINE)) {
                // Add specifier to the list of stored module definitions
                this.definitions.push({
                    index: this.definitionCount + 1,
                    id: name.replace(`${MODULE_DEFINE}.`, ''),
                });
            } else if (name.startsWith(MODULE_FETCH)) {
                // Add specifier to the list of loaded modules
                this.modules.push({ index: this.moduleCount + 1, id: name.replace(`${MODULE_FETCH}.`, '') });
            } else if (name.startsWith(MAPPINGS_FETCH)) {
                // Add specifier to the list of loaded mappings
                this.mappings.push({
                    index: this.mappingsCount + 1,
                    id: name.replace(`${MAPPINGS_FETCH}.`, ''),
                });
            } else if (name.startsWith(MODULE_ERROR) || name.startsWith(MAPPINGS_ERROR)) {
                // Add to the loader error count
                this.loaderErrors++;
            }
        });

        // Calculate loader availability %
        this.loaderAvailability = this.getAvailability(
            this.moduleCount + this.mappingsCount,
            this.loaderErrors,
        );
    }

    adjustBootstrapMetrics(marks: PerformanceEntryList): void {
        // Gather all the bootstrap marks
        marks = marks.filter((e) => e.name.startsWith(BOOTSTRAP_PREFIX));

        // Get bootstrap count (should be 1 after bootstrap is complete)
        const count = marks.reduce((count, mark) => {
            return mark.name === BOOTSTRAP_END ? count + 1 : count;
        }, 0);

        // Get bootstrap errors (should be 0 or 1)
        const errors = marks.reduce((count, mark) => {
            return mark.name === BOOTSTRAP_ERROR ? count + 1 : count;
        }, 0);

        // Calculate bootstrap time and availability %
        const endMarks = globalThis.performance.getEntriesByName(BOOTSTRAP_END);
        this.bootstrapTime = endMarks.length ? endMarks[0].startTime : this.bootstrapTime;
        this.bootstrapAvailability = this.bootstrapAvailability || this.getAvailability(count, errors);
    }

    getAvailability(count: number, errors: number): number {
        // Get service availabililty as a percentage
        return count !== 0 ? ((count - errors) / count) * 100 : 100;
    }

    get hasTime(): boolean {
        return !(this.bootstrapTime === false);
    }

    get hasBAvailability(): boolean {
        return !(this.bootstrapAvailability === false);
    }

    get hasLAvailability(): boolean {
        return !(this.loaderAvailability === false);
    }

    get definitionCount(): number {
        return this.definitions.length;
    }

    get moduleCount(): number {
        return this.modules.length;
    }

    get mappingsCount(): number {
        return this.mappings.length;
    }

    // Dynamically load modules, so more loader metrics are produced
    async loadModuleA(): Promise<void> {
        const mod = await import('example/a');
        this.moduleCtor = mod.default;
    }
    async loadModuleB(): Promise<void> {
        const mod = await import('example/b');
        this.moduleCtor = mod.default;
    }
    async loadModuleC(): Promise<void> {
        const mod = await import('example/c');
        this.moduleCtor = mod.default;
    }
    async loadModuleD(): Promise<void> {
        // This will trigger the "lwr.loader.mapping.error" metric
        const specifier = 'example/d'; // this module DOES NOT EXIST
        try {
            const mod = await import(specifier);
            this.moduleCtor = mod.default;
        } catch {
            this.moduleCtor = undefined;
        }
    }
    async loadModuleE(): Promise<void> {
        // This will trigger the "lwr.loader.module.error" metric
        const specifier = 'example/bad'; // this module produces a BAD mapping
        try {
            const mod = await import(specifier);
            this.moduleCtor = mod.default;
        } catch {
            this.moduleCtor = undefined;
        }
    }
}
