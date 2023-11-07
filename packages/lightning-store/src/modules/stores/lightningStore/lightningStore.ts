// A store has a schema that describes:
// - its inputs, expressed as setters
// - its outputs, expressed as getters
// - its actions, expressed as functions
export default class LightningStore {
    // TODO - set of states likely needs to change
    /*
    get storeStatus(): 'need-config' | 'ready' | 'loading' | 'done' {
        return 'need-config';
    }
    */
    /**
     * 
     * @returns 
    storeRun(): Promise<void> {
        return Promise.resolve();
    }
     */
}

const mappings: Map<any, Record<string, string>> = new Map();
const stores: Record<string, LightningStore> = {};

export function addStoreMapping(context: any, componentIdentifier: string, globalIdentifier: string): void {
    let eltMappings = mappings.get(context);
    if (!eltMappings) {
        mappings.set(context, (eltMappings = {}));
    }

    eltMappings[componentIdentifier] = globalIdentifier;
}

export function registerStore(name: string, store: LightningStore): void {
    stores[name] = store;
}

// TODO - add version: string
export function useStore<T extends LightningStore>(context: any, name: string): T | undefined {
    const mappedName = mappings.get(context)?.[name] || name;
    return stores[mappedName] as T;
}
