import type { ViewRequest, ViewResponse } from 'lwr';

// Return a completely custom response
// containing some JSON data, based on the current path and query parameters
// viewRequest = { url, requestPath, params?, query? }
export default function jsonRouteHandler(viewRequest: ViewRequest): ViewResponse {
    const barPathParam = viewRequest.params.bar;
    const fooQueryParams = viewRequest.query?.foo;

    // return a "ViewResponse": { status?, body, cache?, headers? }
    return {
        // Required: return the response body
        body: {
            bar: barPathParam,
            foo: fooQueryParams,
        },
        // Optional: HTTP header map
        headers: {
            'Content-Type': 'application/json',
        },
    };
}
