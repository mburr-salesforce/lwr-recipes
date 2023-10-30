import type { ContextConsumer, ContextValue, StringKeyedRecord } from 'lwc';

function validateProvider(obj: object): void {
    if (obj === undefined || obj === null) {
        throw new TypeError('Provider must be defined.');
    }
}

/**
 * Manages context for various providers
 */
export class ContextInfo<TContext> {
    private infoMap = new WeakMap();
    /**
     * The default value to be returned in the absence of a defined context
     */
    private defaultValue: TContext;

    constructor(defaultValue: TContext) {
        this.defaultValue = defaultValue;
    }

    /**
     * Gets the stored info for a context provider
     * @param targetProvider the context provider
     */
    getInfo(targetProvider: object): {
        consumers: Set<ContextConsumer<StringKeyedRecord>>;
        contextValue: TContext;
    } {
        let info = this.infoMap.get(targetProvider);
        if (info === undefined) {
            info = { consumers: new Set() };
            this.infoMap.set(targetProvider, info);
        }
        return info;
    }

    /**
     * Set the context value directly associated with the target as a context provider.
     *
     * @param {Object} targetProvider
     * @param {FeatureContext} contextValue
     */
    setContext(targetProvider: object, contextValue: TContext): void {
        validateProvider(targetProvider);
        const info = this.getInfo(targetProvider);
        info.contextValue = contextValue;
        info.consumers.forEach((consumer: ContextConsumer<StringKeyedRecord>) =>
            consumer.provide(contextValue as ContextValue),
        );
    }

    /**
     * Get the context value directly associated with the target as a context provider.
     *
     * @param {Object} targetProvider
     */
    getContext(targetProvider: object): TContext {
        validateProvider(targetProvider);
        const { contextValue } = this.getInfo(targetProvider);
        return contextValue !== undefined ? contextValue : this.defaultValue;
    }

    /**
     * Clear the context value and registered subscribers directly associated with the
     * target as a context provider.
     *
     * @param {Object} targetProvider
     */
    clearContext(targetProvider: object): void {
        validateProvider(targetProvider);
        this.infoMap.delete(targetProvider);
    }

    /**
     * Subscribe a consumer to the context value directly associated with the target as
     * a context provider. Calls to #set(targetProvider, contextValue) with the same
     * target will invoke the consumer.provide(contextValue) function.
     *
     * NOTE: Mutations to the contextValue directly do not result in calls to
     * consumer.provide(contextValue).
     *
     * @param {Object} targetProvider
     * @param {ContextConsumer} consumer object with a provide(context) function property.
     */
    subscribeContext(targetProvider: object, consumer: ContextConsumer<StringKeyedRecord>): void {
        validateProvider(targetProvider);
        const { consumers, contextValue } = this.getInfo(targetProvider);
        if (!consumers.has(consumer)) {
            consumers.add(consumer);
            consumer.provide(contextValue as ContextValue);
        }
    }

    /**
     * Unsubscribe a previously subscribed consumer from listening to changes on the
     * target
     * @param {Object} targetProvider
     * @param {ContextConsumer} consumer
     */
    unsubscribeContext(targetProvider: object, consumer: ContextConsumer<StringKeyedRecord>): void {
        validateProvider(targetProvider);
        this.getInfo(targetProvider).consumers.delete(consumer);
    }
}
