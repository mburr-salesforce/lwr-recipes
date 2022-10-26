import { AbstractModuleId, ModuleCompiled, ModuleEntry, ModuleProvider } from 'lwr';
import { hashContent, readFile } from '@lwrjs/shared-utils';

interface FlagConfig {
    dir: string; // eg: '$rootDir/src'
    package: string; // the specifier prefix, eg: '@salesforce/featureFlag'
    fileType: string; // module file type, eg: 'js' or 'html' or 'css'
}
interface FlagKeyInfo extends FlagConfig {
    flagName: string; // the featureFlag name, eg: 'Lightning.org.featureFlagName' in '@salesforce/featureFlag/Lightning.org.featureFlagName'
}
interface FlagInfo extends FlagKeyInfo {
    flagValue: boolean | undefined; // the resolved featureFlag value
}

const DEFAULT_CONFIG: FlagConfig = {
    dir: 'src',
    package: '@salesforce/featureFlag',
    fileType: 'js',
};

export default class FeatureFlagProvider implements ModuleProvider {
    name = 'feature-flag-provider';
    private namespace = '@salesforce/featureFlag/';
    private version = '1';
    private flagJsonCache: Map<string, boolean> | undefined = undefined;

    // Return generated ES code strings
    generateModule(value: boolean | undefined): string {
        return `export default ${value}`;
    }

    // Return a ModuleEntry, if this provider can handle the incoming module specifier
    async getModuleEntry({ specifier }: AbstractModuleId): Promise<ModuleEntry | undefined> {
        // Modules handled by this provider have specifiers in this form: "@salesforce/featureFlag/{flagName}"
        if (specifier.startsWith(this.namespace)) {
            const info = await this.getFlagInfo(specifier);
            if (info) {
                const safeReference = info.flagName.replace(/\./g, '-');
                return {
                    id: `${specifier}|${this.version}`, // used as part of the cache key for this module by the LWR Module Registry
                    virtual: true, // ...because this is a server-generated module
                    entry: `<virtual>/${info.package}/${safeReference}.js`,
                    specifier,
                    version: this.version,
                };
            }
        }
    }

    getFlags(jsonDir: string): Map<string, boolean> {
        const flagJsonCache = new Map() as Map<string, boolean>;
        const filePath = `${jsonDir}/flags.json`;
        try {
            const json = JSON.parse(readFile(filePath));
            Object.keys(json).forEach(function (ns) {
                const nsJson = json[ns];
                Object.keys(nsJson).forEach(function (context) {
                    const contextJson = nsJson[context];
                    Object.keys(contextJson).forEach(function (flag) {
                        const flagKey = ns + '.' + context + '.' + flag;
                        flagJsonCache.set(flagKey, contextJson[flag] as boolean);
                    });
                });
            });
        } catch (e) {
            // failed to parse json
        }
        return flagJsonCache;
    }

    private async getFlagInfo(specifier: string): Promise<FlagInfo | undefined> {
        // cache not initialized, read json and load cache
        if (this.flagJsonCache === undefined) {
            this.flagJsonCache = this.getFlags(DEFAULT_CONFIG.dir);
        }
        const flagName = specifier.replace(`${DEFAULT_CONFIG.package}/`, '');
        // now search for flagName in loaded cache
        if (this.flagJsonCache.has(flagName)) {
            const flagInfo = { flagName, ...DEFAULT_CONFIG } as FlagKeyInfo;
            const rawValue = this.flagJsonCache.get(flagName);
            return rawValue != undefined ? { ...flagInfo, flagValue: rawValue as boolean } : undefined;
        }
        return undefined; // not defined in json
    }

    async getModule({
        specifier,
        namespace,
        name: message,
    }: AbstractModuleId): Promise<ModuleCompiled | undefined> {
        // Retrieve the Module Entry
        const moduleEntry = await this.getModuleEntry({ specifier });
        if (!moduleEntry || !message) {
            return;
        }

        // Generate code for the requested ES module
        const flagInfo = (await this.getFlagInfo(specifier)) as FlagInfo;
        const compiledSource = this.generateModule(flagInfo.flagValue);

        // Construct a ModuleCompiled object
        return {
            id: moduleEntry.id,
            specifier,
            namespace,
            name: message,
            version: this.version,
            originalSource: compiledSource,
            moduleEntry,
            ownHash: hashContent(compiledSource),
            compiledSource,
        };
    }
}
