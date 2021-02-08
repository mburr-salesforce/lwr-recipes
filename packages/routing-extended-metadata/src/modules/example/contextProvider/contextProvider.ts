import { createContextProvider, Contextualizer } from 'lwc';
import { CurrentRouteMetadata } from 'example/currentRouteMetadata';
import type { ContextualWireAdapter } from 'example/contextUtils';

export const currentRouteMetadataContextualizer = createContextProvider(CurrentRouteMetadata);

/**
 *
 * @param {TContext} contextValue - Context API object
 * @param {EventTarget} providerNode - Context DOM element
 * @param {Contextualizer} contextualizer - Function for providing this context to subtree nodes wired to a specific adapter
 * @param {ContextualWireAdapter<TContext, TEmit, TConfig>} contextualAdapter - Contextual wire adapter capable of subscribing to context changes
 */
export function provideContext<TContext, TEmit, TConfig>(
    contextValue: TContext,
    providerNode: EventTarget,
    contextualizer: Contextualizer,
    contextualAdapter: ContextualWireAdapter<TContext, TEmit, TConfig>,
): void {
    // Set up provider to give context to wire adapters so that a component connected
    // under the providerNode subtree and wired to those adapters will receive this id
    contextualAdapter.setContext(providerNode, contextValue);
    contextualizer(providerNode, {
        // bind is used to set "this" to contextualAdapter and set providerNode as the
        // first argument to subscribeContext/unsubscribeContext
        consumerConnectedCallback: contextualAdapter.subscribeContext.bind(contextualAdapter, providerNode),
        consumerDisconnectedCallback: contextualAdapter.unsubscribeContext.bind(
            contextualAdapter,
            providerNode,
        ),
    });
}
