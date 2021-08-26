import type { FetchResponse, Headers as LuvioHeaders, ResourceRequest } from '@luvio/engine';

/**
 * Authenticated UI API Luvio Network Adapter
 */

// See LDS error handling: https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.data_error
class RecordError extends Error {
    body: { message: string };
    ok: boolean;
    status: number;
    statusText: string;
    constructor(message: string, status = 404) {
        super(message);
        this.body = { message };
        this.ok = false;
        this.status = status;
        this.statusText = message;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createNetworkAdapter(): (req: ResourceRequest) => Promise<FetchResponse<any>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function networkAdapter(req: ResourceRequest): Promise<FetchResponse<any>> {
        // Build an authenticated request to the UI API
        const { instance_url, access_token } = getOAuthInfoFromCookie();
        if (instance_url && access_token) {
            const { baseUri, basePath, body, queryParams, method, headers } = req;
            const path = `${instance_url}${baseUri}${basePath}${generateQueryString(queryParams)}`;
            try {
                const res = await fetch(path, {
                    method: method.toUpperCase(),
                    headers: generateHeaders({
                        ...headers,
                        Authorization: `Bearer ${access_token}`, // pass the OAuth token
                    }),
                    body: body === null ? null : JSON.stringify(body),
                });
                if (res.ok) {
                    return {
                        body: res.status === 204 ? undefined : await res.json(), // HTTP 204 = No Content
                        status: res.status,
                        statusText: res.statusText,
                        ok: res.ok,
                        headers: {},
                    };
                }
                // Request goes through but returns HTTP errors
                throw new RecordError(res.statusText, res.status);
            } catch (e) {
                // Return the failure; no response status => 401
                // e.g. CORS or prefetch errors
                throw new RecordError(e.message, e.status >= 0 ? e.status : 401);
            }
        } else {
            // There is no authentication data available to make this request
            throw new RecordError('You are not authenticated.', 401);
        }
    };
}

function getOAuthInfoFromCookie(): { instance_url?: string; access_token?: string } {
    const oauthInfoStr = document.cookie.split('; ').find((c) => c.startsWith('lwr_recipe='));
    return oauthInfoStr ? JSON.parse(decodeURIComponent(oauthInfoStr.split('=')[1])) : {};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateQueryString(params: Record<string, any>): string {
    const queryStrings = [] as string[];
    for (const key of Object.keys(params)) {
        const value = Array.isArray(params[key]) ? params[key].join(',') : params[key];
        if (value) {
            queryStrings.push(`${key}=${value}`);
        }
    }
    return queryStrings.length > 0 ? `?${queryStrings.join('&')}` : '';
}

function generateHeaders(headers: LuvioHeaders): globalThis.Headers {
    const fetchHeaders = new globalThis.Headers();
    for (const key of Object.keys(headers)) {
        fetchHeaders.set(key, headers[key]);
    }
    fetchHeaders.set('Accept', 'application/json');
    fetchHeaders.set('Content-Type', 'application/json');
    return fetchHeaders;
}
