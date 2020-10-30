import { log } from 'example/logger';

export default function exampleHooks(serviceAPI) {
    // Add loader plugins
    serviceAPI.addLoaderPlugin({
        // Add a hook to resolve a module URL, given a module ID
        resolveModule: async (id, { parentUrl }) => {
            // If the component is named "example/dynamic/v/*",
            //      then create a URL to the latest version
            if (id.startsWith('example/dynamic')) {
                const url = `${parentUrl}1/module/prod/i/${encodeURIComponent(id)}/latest`;
                log(`The "resolveModule" hook triggered with URL "${url}"`);
                return { url };
            }
            // Defer to next hook or loader default
            return null;
        },

        // Add a hook that resolves module content, given a URL
        loadModule: async (url) => {
            // Intercept the loading for the "example/dynamic" component
            if (url.indexOf('example%2Fdynamic') >= 0) {
                log(`The "loadModule" hook will fetch URL "${url}"`);
                return fetch(url);
            }
            // Defer back to loader
            return null;
        },

    });
}
