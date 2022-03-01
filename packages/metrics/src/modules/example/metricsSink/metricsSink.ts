// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { BOOTSTRAP_PREFIX, BOOTSTRAP_END, BOOTSTRAP_ERROR } from 'lwr/metrics';

export default function (): void {
    if (PerformanceObserver) {
        // Watch for new metrics
        const observer = new PerformanceObserver((list) => {
            // Gather all the bootstrap marks
            const bootstrapMarks = list.getEntries().filter((e) => e.name.startsWith(BOOTSTRAP_PREFIX));

            // Get bootstrap end count (should be 0 or 1)
            const bootstrapEndCount = bootstrapMarks.reduce((count, mark) => {
                return mark.name === BOOTSTRAP_END ? count + 1 : count;
            }, 0);

            // Get bootstrap error count (should be 1 or 0)
            const bootstrapErrorCount = bootstrapMarks.reduce((count, mark) => {
                return mark.name === BOOTSTRAP_ERROR ? count + 1 : count;
            }, 0);

            if (bootstrapEndCount > 0 || bootstrapErrorCount > 0) {
                // These metrics only occur once, so disconnect after they are received
                observer.disconnect();

                // Send the metrics to the server to be [mock] recorded
                fetch('/lwr/metrics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        bootstrapEndCount,
                        bootstrapErrorCount,
                    }),
                });
            }
        });

        observer.observe({ entryTypes: ['mark'] });
    } else {
        console.error('Error: The metrics sink bootstrap service cannot access the Performance API.');
    }
}
