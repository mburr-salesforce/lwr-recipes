// Return customized input, from which the LWR server will construct a response
// viewRequest = { url, requestPath, params?, query? }
// handlerContext = { route, viewApi: { hasViewResponse, getViewResponse } }
export default async function echoRouteHandler(viewRequest, handlerContext) {
    const routeProperties = handlerContext.route.properties || {};
    const message = viewRequest.params.message;

    // return a "ViewDefinitionResponse"
    return {
        // Required: customize the current route by setting:
        // { rootComponent?, contentTemplate?, layoutTemplate? }
        view: {
            contentTemplate: '$contentDir/echo.html',
        },
        // Required: pass context to the templates
        viewParams: {
            message, // pass the "message" path param
            ...routeProperties, // pass the static route properties
        },
        // Optional: rendering options { skipMetadataCollection?, freezeAssets?, skipCaching? }
        renderOptions: {
            freezeAssets: true,
        },
        // Optional: caching options { ttl? }
        cache: {
            ttl: 200,
        },
    };
}
