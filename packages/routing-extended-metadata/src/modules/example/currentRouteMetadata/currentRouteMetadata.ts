import { generateContextualWireAdapter, ContextInfo } from 'example/contextUtils';
import type { RouteDefinition } from 'lwr/router';

/**
 * Create a specific metadata type.  Since ExtendedRouteDefinition makes
 * metadata required, this means any use of ExtendedRouteDefition will
 * be required to have metadata with these three properties.
 */
export type ExtendedMetadata = {
    isPublic: boolean;
    label: String;
    devName: String;
};

export interface ExtendedRouteDefinition extends RouteDefinition {
    // makes metadata a mandatory property
    metadata: ExtendedMetadata;
}

const CURRENT_ROUTE_METADATA_CONTEXT = new ContextInfo<RouteMetadataContext>(undefined);

/** Make sure that if there's metadata it is always of type ExtendedMetadata */
type RouteMetadataContext = ExtendedMetadata | undefined;

/**
 * Services @wire(CurrentRouteMetadata) requests.
 * Hooks up to an Observable from the current navigation context.
 */
export const CurrentRouteMetadata = generateContextualWireAdapter<RouteMetadataContext>(
    CURRENT_ROUTE_METADATA_CONTEXT,
);
