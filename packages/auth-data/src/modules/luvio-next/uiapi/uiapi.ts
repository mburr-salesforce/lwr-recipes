import { WireAdapter, WireDataCallback } from 'lwc';
import { NetworkAdapter, NetworkBasedAdapter, WithErrors } from '@luvio/runtime';

export type Theme = Record<string, unknown>;

const networkAdapter: NetworkAdapter = window.fetch.bind(window);

export class GetActiveTheme extends NetworkBasedAdapter<undefined, Theme> {
    fetch(): Promise<WithErrors<Theme>> {
        return this.runtime
            .networkAdapter('/services/data/v56.0/ui-api/themes/active', {
                method: 'GET',
                headers: { Accept: 'application/json' },
            })
            .then(async (resp: Response) => {
                if (resp.ok) {
                    return {
                        result: await resp.json(),
                        errors: [],
                    };
                }
                throw new Error(resp.statusText);
            });
    }

    validateConfig(): undefined {
        return;
    }
}

export class getActiveTheme implements WireAdapter {
    connected = false;

    constructor(private dataCallback: WireDataCallback) {}

    update(): void {
        // do nothing
    }

    connect(): void {
        new GetActiveTheme(undefined, {}, { networkAdapter }).run().then((invocationResult) => {
            this.dataCallback(
                invocationResult.errors.length > 0
                    ? { data: undefined, error: invocationResult.errors[0] }
                    : { data: invocationResult.result, error: undefined },
            );
        });
    }

    disconnect(): void {
        // do nothing
    }
}
