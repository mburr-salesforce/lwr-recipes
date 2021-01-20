import * as path from 'path';
import { AbstractModuleId, ModuleCompiled, ModuleEntry, ModuleProvider } from '@lwrjs/types';
import { hashContent } from '@lwrjs/shared-utils';

// This Module Provider returns generated ES modules.
// The returns a message parsed from the module specifier.
// The module specifiers handled in this provider take the form: "echo/{message}"

// Return generated ES code strings
function generateModule(message: string): string {
    return `export default "${message}"`;
}

export default class EchoProvider implements ModuleProvider {
    name = 'echo-provider';
    private namespace = 'echo/';
    private version = '1';

    // Return a ModuleEntry, if this provider can handle the incoming module specifier
    async getModuleEntry({ specifier }: AbstractModuleId): Promise<ModuleEntry | undefined> {
        // Modules handled by this provider have specifiers in this form: "echo/{message}"
        if (specifier.startsWith(this.namespace)) {
            return {
                id: `${specifier}|${this.version}`, // used as part of the cache key for this module by the LWR Module Registry
                virtual: true, // ...because this is a server-generated module
                entry: `<virtual>/${specifier}${path.extname(specifier) ? '' : '.js'}`,
                specifier,
                version: this.version,
            };
        }
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
        const originalSource = generateModule(message);

        // Construct a Module Source object
        return {
            id: moduleEntry.id,
            specifier,
            namespace,
            name: message,
            version: this.version,
            originalSource,
            moduleEntry,
            ownHash: hashContent(originalSource),
            // Note: there is no need to compile this module
            // The Module Registry will compile the code from ES, if needed
            compiledSource: originalSource,
        };
    }
}
