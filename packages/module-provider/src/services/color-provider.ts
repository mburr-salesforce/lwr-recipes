import * as path from 'path';
import { AbstractModuleId, ModuleCompiled, ModuleEntry, ModuleProvider } from '@lwrjs/types';
import { hashContent } from '@lwrjs/shared-utils';

function parseModuleName(name: string): { color: string; fileType: string } {
    // colorName = 'purple' or 'purple#purple.html' or 'purple#purple.css'
    const [color] = name.split('#');
    const fileType = (path.extname(name) || '.js').substr(1);
    // eg: { color: 'purple', fileType: 'js' }
    return { color, fileType };
}

function generateModule(colorName: string): string {
    const { color, fileType } = parseModuleName(colorName);
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

function print(message: string): void {
    console.log(`\n***********************\n${message}\n***********************\n`);
}

export default class ColorProvider implements ModuleProvider {
    name = 'color-provider';
    namespace = 'color/';
    version = '1';

    constructor() {
        print('Custom Module Provider has started!');
    }

    async getModuleEntry({ specifier }: AbstractModuleId): Promise<ModuleEntry | undefined> {
        // Modules handled by this provider have specifiers in this form: "color/{colorName}"
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

    async getModule({ specifier, namespace, name }: AbstractModuleId): Promise<ModuleCompiled | undefined> {
        // Retrieve the Module Entry
        const moduleEntry = await this.getModuleEntry({ specifier });
        if (!moduleEntry || !name) {
            return;
        }

        // Generate code for the requested module
        const originalSource = generateModule(name);
        const { color, fileType } = parseModuleName(name);
        print(`Color Module Provider returning ${fileType} code for color "${color}": ${originalSource}`);

        // Construct a Module Source object
        return {
            id: moduleEntry.id,
            specifier,
            namespace,
            name,
            version: this.version,
            originalSource,
            moduleEntry,
            ownHash: hashContent(originalSource),
            compiledSource: originalSource,
        };
    }
}
