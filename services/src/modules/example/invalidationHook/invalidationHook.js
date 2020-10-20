import { warn } from 'example/logger';

export default function exampleHooks(serviceAPI) {
    serviceAPI.handleStaleModule(({ name, referencedBy, oldHash, newHash }) => {
        // Only act in production mode
        const isDevMode = process.env.NODE_ENV === 'dev';
        if (!isDevMode) {
            // Display a warning and confirm to reload the page, if a stale module is found
            // const { name, referencedBy, oldHash, newHash } = args;
            warn(`stale module detected: "${name}", referenced by: "${referencedBy}", old hash: "${oldHash}", new hash: "${newHash}"`);
            const result = confirm('Your application is out of date, press ok to refresh');
            if (result === true) {
                window.location.reload();
            }
        }
    });
}
