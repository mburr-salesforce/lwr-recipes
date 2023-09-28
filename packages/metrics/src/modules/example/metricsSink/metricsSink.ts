/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
    BOOTSTRAP_PREFIX,
    BOOTSTRAP_END,
    BOOTSTRAP_ERROR,
    INIT_MODULE,
    MODULE_DEFINE,
    MODULE_DYNAMIC_LOAD, // @ts-ignore
} from 'lwr/metrics';
export default function (): void {
    if (PerformanceObserver) {
        let existingMarks: PerformanceEntry[] | null;
        let existingDynamicMarks: PerformanceEntry[] | null;
        if (performance) {
            existingMarks = performance
                .getEntriesByType('mark')
                .filter((e) => e.name.startsWith(MODULE_DEFINE));
            existingDynamicMarks = performance
                .getEntriesByType('mark')
                .filter((e) => e.name.startsWith(MODULE_DYNAMIC_LOAD));
        }

        // Watch for new metrics
        const observer = new PerformanceObserver((list) => {
            // Gather all the bootstrap marks
            const bootstrapMarks = list.getEntries().filter((e) => e.name.startsWith(BOOTSTRAP_PREFIX));
            const moduleMarks = list.getEntries().filter((e) => e.name.startsWith(MODULE_DEFINE));
            const dynamicMarks = list.getEntries().filter((e) => e.name.startsWith(MODULE_DYNAMIC_LOAD));
            // Get bootstrap end count (should be 0 or 1)
            const bootstrapEndCount = bootstrapMarks.reduce((count, mark) => {
                return mark.name === BOOTSTRAP_END ? count + 1 : count;
            }, 0);

            // Get bootstrap error count (should be 1 or 0)
            const bootstrapErrorCount = bootstrapMarks.reduce((count, mark) => {
                return mark.name === BOOTSTRAP_ERROR ? count + 1 : count;
            }, 0);

            // Get root module initialization count
            const moduleInitCount = bootstrapMarks.reduce((count, mark) => {
                return mark.name.startsWith(INIT_MODULE) ? count + 1 : count;
            }, 0);

            // Remove lwr.loader.module.define- and version name from mark
            const processMarkNames = (markName: string): string => {
                return markName.replace(/lwr\.loader\.module\.define-|\/v\/.*/g, '');
            };
            const processDynamicMarkNames = (markName: string): string => {
                return markName.replace(/lwr\.loader\.moduleRegistry\.dynamicLoad-|\/v\/.*/g, '');
            };

            let moduleMarkNames: string[] = moduleMarks.map((mark) => processMarkNames(mark.name));
            if (existingMarks) {
                const existingMarkNames: string[] = existingMarks.map((mark) => processMarkNames(mark.name));
                moduleMarkNames = [...existingMarkNames, ...moduleMarkNames];
                existingMarks = null;
            }
            let dynamicMarkNames: string[] = dynamicMarks.map((mark) => processDynamicMarkNames(mark.name));
            if (existingDynamicMarks) {
                const existingDynamicMarkNames: string[] = existingDynamicMarks.map((mark) =>
                    processDynamicMarkNames(mark.name),
                );
                dynamicMarkNames = [...existingDynamicMarkNames, ...dynamicMarkNames];
                existingDynamicMarks = null;
            }

            const nameCounts: { [key: string]: number } = {};
            moduleMarkNames.forEach((e: string) => {
                nameCounts[e] = (nameCounts[e] || 0) + 1;
            });

            const dynamicNameCounts: { [key: string]: number } = {};
            dynamicMarkNames.forEach((e: string) => {
                dynamicNameCounts[e] = (dynamicNameCounts[e] || 0) + 1;
            });
            // Send the metrics to the server to be [mock] recorded
            fetch('/lwr/metrics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bootstrapEndCount,
                    bootstrapErrorCount,
                    moduleInitCount,
                    nameCounts,
                    dynamicNameCounts,
                }),
            });
        });

        observer.observe({ entryTypes: ['mark'] });
    } else {
        console.error('Error: The metrics sink bootstrap service cannot access the Performance API.');
    }
}
