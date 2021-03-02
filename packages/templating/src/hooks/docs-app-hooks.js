import path from 'path';
import { slugify } from '@lwrjs/shared-utils';

const DEFAULT_MAIN_LAYOUT = 'main_layout.njk';
const CACHE_TTL = '30m';

function generateGuideSidebar(guide) {
    return guide.map(({ label, content }) => {
        return {
            label,
            id: `guide_${slugify(label)}`,
            url: `/${content.replace('.md', '')}`,
        };
    });
}

function generateGuideRoutes(guide, { contentDir, layoutsDir }) {
    return guide.map(({ label, content }) => {
        return {
            id: `guide_${slugify(label)}`,
            path: `/${content.replace('.md', '')}`,
            contentTemplate: path.join(contentDir, content),
            layoutTemplate: path.join(layoutsDir, DEFAULT_MAIN_LAYOUT),
            cache: { ttl: CACHE_TTL },
        };
    });
}

// Export an Application Configuration hook
// Configured in lwr.config.json[hooks]
export function initConfigs(lwrConfig, globalData) {
    // The guide is an ordered list of files we want to display
    // Hardcoded here: src/data/site/guide.json
    const guide = globalData.site.guide;

    // Generate sidebar add it to the globalData object
    // The data is accessed in src/layouts/partials/guide-sidebar.njk
    globalData.site.sidebar = generateGuideSidebar(guide, lwrConfig);

    // Dynamically add a new route for each guide
    // Note: other routes are statically declared in lwr.config.json[routes]
    lwrConfig.routes.push(...generateGuideRoutes(guide, lwrConfig));
}
