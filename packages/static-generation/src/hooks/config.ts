import path from 'path';
import { slugify } from '@lwrjs/shared-utils';
import type { NormalizedLwrGlobalConfig, HooksPlugin } from 'lwr';
import type { GlobalData, NormalizedLwrRoute } from '@lwrjs/types';

const DEFAULT_MAIN_LAYOUT = 'main_layout.njk';

interface GuideEntry {
    label: string;
    content: string;
}
interface NavbarEntry {
    id: string;
    name: string;
    url: string;
}
interface SidebarEntry {
    label: string;
    id: string;
    url: string;
}

interface DocSiteGlobalData extends GlobalData {
    site: {
        guide: GuideEntry[];
        navbar: NavbarEntry[];
        sidebar: SidebarEntry[];
    };
}

function generateGuideSidebar(guide): SidebarEntry[] {
    return guide.map(({ label, content }) => {
        return {
            label,
            id: `guide_${slugify(label)}`,
            url: `/${content.replace('.md', '')}`,
        };
    });
}

function generateGuideRoutes(
    guide: GuideEntry[],
    { contentDir, layoutsDir }: NormalizedLwrGlobalConfig,
): NormalizedLwrRoute[] {
    return guide.map(({ label, content }) => {
        const contentTemplate = path.join(contentDir, content);
        const id = `guide_${slugify(label)}`;
        const url = `/${content.replace('.md', '')}`;
        return {
            id,
            path: url,
            contentTemplate,
            layoutTemplate: path.join(layoutsDir, DEFAULT_MAIN_LAYOUT),
            properties: {
                title: `LWR - ${label}`,
            },
        } as unknown as NormalizedLwrRoute;
    });
}

export default class DocAppHooks implements HooksPlugin {
    initConfigs(lwrConfig: NormalizedLwrGlobalConfig, globalData: DocSiteGlobalData): void {
        // The guide is just the ordered list of files we want
        const guide = globalData.site.guide;

        // Generate sidebar add it to the globalData object
        const sidebar = generateGuideSidebar(guide);
        globalData.site.sidebar = sidebar;

        // Add new routes dynamically
        lwrConfig.routes.push(...generateGuideRoutes(guide, lwrConfig));
    }
}
