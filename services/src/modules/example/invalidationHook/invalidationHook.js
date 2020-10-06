import { warn } from 'example/logger';
import { subscribe } from 'lwr/moduleInvalidation';

export default function exampleHooks() {
    // Subscribe to the "lwr/moduleInvalidationHook"
    subscribe((args) => {
        // Only act in production mode
        const isDevMode = process.env.NODE_ENV === 'dev';
        if (!isDevMode) {
            // Display a warning and confirm to reload the page, if a stale module is found
            const { name, referencedBy, oldHash, newHash } = args;
            warn(`stale module detected: "${name}", referenced by: "${referencedBy}", old hash: "${oldHash}", new hash: "${newHash}"`);
            const result = confirm('Your application is out of date, press ok to refresh');
            if (result === true) {
                window.location.reload();
            }
        }
    });
}
