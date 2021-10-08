import type { ContextConsumer } from 'lwc';

import { ContextInfo } from './contextInfo';
export { ContextInfo };

export interface WireAdapter<TContext, TConfig, TEmit> {
    _callback(value: TEmit): void;
    update(config: TConfig, context: TContext): void;
    connect(): void;
    disconnect(): void;
}

/**
 * Interface for contextual wire adapters to subscribe to context changes
 */
export interface ContextualWireAdapter<TContext, TConfig, TEmit> {
    new (callback: (value: TEmit) => void): WireAdapter<TContext, TConfig, TEmit>;
    setContext: (targetProvider: globalThis.EventTarget, contextValue: TContext) => void;
    getContext: (targetProvider: globalThis.EventTarget) => TContext;
    clearContext: (targetProvider: globalThis.EventTarget) => void;
    subscribeContext: (targetProvider: globalThis.EventTarget, consumer: ContextConsumer) => void;
    unsubscribeContext: (targetProvider: globalThis.EventTarget, consumer: ContextConsumer) => void;
}

export function generateContextualWireAdapter<TContext, TConfig = unknown, TEmit = TContext>(
    contextInstance: ContextInfo<TContext>,
): ContextualWireAdapter<TContext, TConfig, TEmit> {
    const Adapter: ContextualWireAdapter<TContext, TConfig, TEmit> = class Adapter {
        constructor(callback: (value: TEmit) => void) {
            this._callback = callback;
        }

        connect(): void {
            //There is no 'connect' because context is provided via the update API.
        }

        disconnect(): void {
            //no-op
        }

        _callback: (value: TEmit) => void;

        //The default update method services wires that emit context as TEmit when their value changes.
        //Wires that need more complex logic or use another emit type should override this method.
        update(config: TConfig, context: TContext): void {
            if (context) {
                this._callback((context as unknown) as TEmit);
            }
        }

        /**
         * Set the context value directly associated with the target as a context provider.
         *
         * @param {EventTarget} targetProvider
         * @param {ContextId} contextValue
         */
        static setContext(targetProvider: globalThis.EventTarget, contextValue: TContext): void {
            contextInstance.setContext(targetProvider, contextValue);
        }

        /**
         * Get the context value directly associated with the target as a context provider.
         *
         * @param {EventTarget} targetProvider
         */
        static getContext(targetProvider: globalThis.EventTarget): TContext {
            return contextInstance.getContext(targetProvider);
        }

        /**
         * Clear the context value and registered subscribers directly associated with the
         * target as a context provider.
         *
         * @param {EventTarget} targetProvider
         */
        static clearContext(targetProvider: globalThis.EventTarget): void {
            contextInstance.clearContext(targetProvider);
        }

        /**
         * Subscribe a consumer to the context value directly associated with the target as
         * a context provider. Calls to #set(targetProvider, contextValue) with the same
         * target will invoke the consumer.provide(contextValue) function.
         *
         * NOTE: Mutations to the contextValue directly do not result in calls to
         * consumer.provide(contextValue).
         *
         * @param {EventTarget} targetProvider
         * @param {ContextConsumer} consumer object with a provide(context) function property.
         */
        static subscribeContext(targetProvider: globalThis.EventTarget, consumer: ContextConsumer): void {
            contextInstance.subscribeContext(targetProvider, consumer);
        }

        /**
         * Unsubscribe a previously subscribed consumer from listening to changes on the
         * target
         * @param {EventTarget} targetProvider
         * @param {ContextConsumer} consumer
         */
        static unsubscribeContext(targetProvider: globalThis.EventTarget, consumer: ContextConsumer): void {
            contextInstance.unsubscribeContext(targetProvider, consumer);
        }

        static contextSchema = { value: 'required' };
    };

    return Adapter;
}
