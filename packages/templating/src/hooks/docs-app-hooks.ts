import path from 'path';
import { DEFAULT_LWR_BOOTSTRAP_CONFIG, slugify } from '@lwrjs/shared-utils';
import type { HooksPlugin, NormalizedLwrGlobalConfig, NormalizedLwrRoute } from '@lwrjs/types';

const DEFAULT_MAIN_LAYOUT = 'main_layout.njk';
const CACHE_TTL = '30m';
interface GuideItem {
    label: string;
    content: string;
}
interface GuideSidebarItem {
    label: string;
    id: string;
    url: string;
}
interface GlobalData {
    site: {
        guide: GuideItem[];
        sidebar: GuideSidebarItem[];
    };
}

function generateGuideSidebar(guide: GuideItem[]): GuideSidebarItem[] {
    return guide.map(({ label, content }) => {
        return {
            label,
            id: `guide_${slugify(label)}`,
            url: `/${content.replace('.md', '')}`,
        };
    });
}

function generateGuideRoutes(
    guide: GuideItem[],
    { contentDir, layoutsDir }: NormalizedLwrGlobalConfig,
): NormalizedLwrRoute[] {
    return guide.map(({ label, content }) => {
        return {
            id: `guide_${slugify(label)}`,
            path: `/${content.replace('.md', '')}`,
            contentTemplate: path.join(contentDir, content),
            layoutTemplate: path.join(layoutsDir, DEFAULT_MAIN_LAYOUT),
            cache: { ttl: CACHE_TTL },
            bootstrap: DEFAULT_LWR_BOOTSTRAP_CONFIG,
        };
    });
}

// Export an Application Configuration hook
// Configured in lwr.config.json[hooks]
export default class MyAppHooks implements HooksPlugin {
    initConfigs(lwrConfig: NormalizedLwrGlobalConfig, globalData: GlobalData): void {
        // The guide is an ordered list of files we want to display
        // Hardcoded here: src/data/site/guide.json
        const guide = globalData.site.guide;

        // Generate sidebar add it to the globalData object
        // The data is accessed in src/layouts/partials/guide-sidebar.njk
        globalData.site.sidebar = generateGuideSidebar(guide);

        // Dynamically add a new route for each guide
        // Note: other routes are statically declared in lwr.config.json[routes]
        lwrConfig.routes.push(...generateGuideRoutes(guide, lwrConfig));
    }
}
