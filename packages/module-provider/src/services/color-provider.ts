import path from 'path';
import {
    AbstractModuleId,
    FsModuleEntry,
    ModuleCompiled,
    ModuleEntry,
    ModuleProvider,
    ModuleSource,
} from 'lwr';
import LwcModuleProvider from '@lwrjs/lwc-module-provider';
import { hashContent } from '@lwrjs/shared-utils';

// This Module Provider returns generated LWC modules.
// The LWC displays a circle filled with the color parsed from the module specifier.
// The module specifiers handled in this provider take the form: "color/{colorName}"

interface ColorModule {
    color: string; // eg: red, blue, green
    fileType: string; // LWC file types: html, css or js
}

// Pull the color and file extension/type from the module specifier
function parseModuleName(name: string): ColorModule {
    // colorName = 'purple' or 'purple#purple.html' or 'purple#purple.css'
    const [color] = name.split('#');
    const fileType = (path.extname(name) || '.js').substr(1);
    // eg: { color: 'purple', fileType: 'js' }
    return { color, fileType };
}

// Return generated LWC code strings by file type: js, css or html
function generateModule({ color, fileType }: ColorModule): string {
    switch (fileType) {
        case 'html':
            return `
<template>
    <div>
        <h1>${color}</h1>
    </div>
</template>`;
        case 'css':
            return `
h1 {
    color: white;
}
div {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    width: 300px;
    border-radius: 150px;
    background-color: ${color};
}`;
        default:
            // 'js'
            return `
/* Generated Color Module for "${color}" */
import { LightningElement } from 'lwc';
export default class ${color.charAt(0).toUpperCase()}${color.slice(1)}Color extends LightningElement { }`;
    }
}

// Helper for printing messages from this provider
function print(message: string): void {
    console.log(`\n***********************\n${message}\n***********************\n`);
}

// When generating LWCs, extend the LwcModuleProvider in order to handle LWC compilation
export default class ColorProvider extends LwcModuleProvider implements ModuleProvider {
    name = 'color-provider';
    private namespace = 'color/';
    private version = '1';

    // Return a ModuleEntry, if this provider can handle the incoming module specifier
    async getModuleEntry({ specifier }: AbstractModuleId): Promise<FsModuleEntry | undefined> {
        // Modules handled by this provider have specifiers in this form: "color/{colorName}"
        if (specifier.startsWith(this.namespace)) {
            return {
                id: `${specifier}|${this.version}`, // used as part of the cache key for this module by the LWR Module Registry
                entry: `<virtual>/${specifier}${path.extname(specifier) ? '' : '.js'}`,
                specifier,
                version: this.version,
            };
        }
    }

    // Return a ModuleSource object, which includes the generated code as `originalSource`
    async getModuleSource(
        { name, namespace, specifier }: AbstractModuleId,
        moduleEntry: ModuleEntry,
    ): Promise<ModuleSource> {
        // Generate code for the requested module
        const colorName = specifier.replace(this.namespace, '');
        const { color, fileType } = parseModuleName(colorName);
        const originalSource = generateModule({ color, fileType });
        print(`Color Module Provider returning ${fileType} code for color "${color}": ${originalSource}`);

        // Create and return a ModuleSource object
        const { version, id } = moduleEntry;
        return {
            id,
            specifier,
            namespace,
            name: name || specifier,
            version,
            moduleEntry,
            ownHash: hashContent(originalSource),
            originalSource,
        };
    }

    // This method handles LWC compilation => let the superclass handle this processing
    // It calls `getModuleSource` under the covers
    async getModule(moduleId: AbstractModuleId): Promise<ModuleCompiled | undefined> {
        return super.getModule(moduleId);
    }
}
