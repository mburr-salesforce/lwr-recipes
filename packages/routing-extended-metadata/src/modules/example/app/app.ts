import { LightningElement } from 'lwc';
import { createRootRouter } from 'example/rootRouter';
import { NAV_ITEMS } from './navItems';
import type { RoutingResult } from 'lwr/router';
import { CurrentRouteMetadata, ExtendedRouteDefinition } from 'example/currentRouteMetadata';
import { currentRouteMetadataContextualizer, provideContext } from 'example/contextProvider';

export default class RoutingExtendedMetadataApp extends LightningElement {
    router = createRootRouter();
    navItems = NAV_ITEMS;

    connectedCallback(): void {
        // by providing context, this dom node says it will provide the value of
        // current route metadata to its child nodes.  This is the glue that allows
        // other nodes to get the wire value.
        provideContext(undefined, this, currentRouteMetadataContextualizer, CurrentRouteMetadata);
    }

    postNavigateCallback(result: CustomEvent): void {
        // set the value of the context wire for current Route metadata
        const info = result.detail as RoutingResult;
        const routeDef = info.routeDefinition as ExtendedRouteDefinition;
        CurrentRouteMetadata.setContext(this, routeDef.metadata);
    }
}
