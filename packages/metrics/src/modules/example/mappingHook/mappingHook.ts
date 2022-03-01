import type { ImportMetadata, ServiceAPI } from '@lwrjs/types';

export default function badMappingHook(serviceAPI: ServiceAPI): void {
    serviceAPI.addLoaderPlugin({
        loadMapping: async function (id: string): Promise<ImportMetadata | null> {
            if (id === 'example/bad') {
                // Return a mapping with broken URIs for the "example/bad" module
                // This will trigger the "lwr.loader.module.error" metric
                return {
                    imports: { '/does/not/exist': ['example/bad'] },
                    index: { 'example/bad': '/does/not/exist' },
                };
            } else {
                // Otherwise, defer to the AMD loader
                return null;
            }
        },
    });
}
