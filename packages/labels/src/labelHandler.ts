import { existsSync } from 'fs';
import { readFile } from '@lwrjs/shared-utils';
import type { HandlerContext, LocalizedViewRequest, RouteHandlerViewResponse } from '@lwrjs/types';

const DEFAULT_LOCALE = 'en';

// Read and parse the translation JSON file, then return the "title" value with the language
function getViewParams(locale: string, rootDir: string): { title: string; language: string } {
    let language = locale;
    let localePath = `${rootDir}/src/labels/${locale}.json`;
    if (!existsSync(localePath)) {
        // Try the locale without a country code (eg: "es-MX" -> "es")
        language = locale.substring(0, 2);
        localePath = `${rootDir}/src/labels/${language}.json`;
        if (language === locale || !existsSync(localePath)) {
            // Fall back to the default locale
            language = DEFAULT_LOCALE;
            localePath = `${rootDir}/src/labels/${DEFAULT_LOCALE}.json`;
        }
    }
    const json = JSON.parse(readFile(localePath));
    return { title: json.title, language };
}

// Return translated strings to be used in the layout template
export default function translationRouteHandler(
    viewRequest: LocalizedViewRequest,
    context: HandlerContext,
): RouteHandlerViewResponse {
    const locale = viewRequest.locale || DEFAULT_LOCALE;
    const params = getViewParams(locale.toLocaleLowerCase(), context.rootDir);
    return {
        view: {
            // This layout template uses the viewParams
            layoutTemplate: '$rootDir/src/layout.html',
        },
        viewParams: {
            // available as {{title}} or {{page.title}} in the layout template
            title: params.title,
            // available as {{language}} in the layout template
            language: params.language,
        },
    };
}
