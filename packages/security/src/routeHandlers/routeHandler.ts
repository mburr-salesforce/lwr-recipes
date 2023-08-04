import type {
    HandlerContext,
    LocalizedViewRequest,
    RouteHandlerFunction,
    RouteHandlerViewResponse,
} from 'lwr';
import { secure } from '@lwrjs/security';
const routeHandler: RouteHandlerFunction = async (
    viewRequest: LocalizedViewRequest,
    handlerContext: HandlerContext,
): Promise<RouteHandlerViewResponse> => {
    return {
        view: handlerContext.route,
        viewParams: {},
        headers: {
            'content-security-policy': "script-src 'self'",
            'example-custom-header': 'example',
        },
    };
};
export default secure(routeHandler);
