import * as path from 'path';
import { 
    Compiler,
    CompiledModule,
    ModuleEntry,
    ModuleIdentifier,
    ModuleProvider,
    ModuleSource,
    ProviderContext,
    ResolverConfig,
} from '@lwrjs/types';
import { getSpecifier, hashContent } from '@lwrjs/shared-utils';

function parseModuleName(name: string): { color: string; fileType: string; } {
    // colorName = 'purple' or 'purple#purple.html' or 'purple#purple.css'
    const [color] = name.split('#');
    const fileType = (path.extname(name) || '.js').substr(1);
    // eg: { color: 'purple', fileType: 'js' }
    return { color, fileType };
}

function generateModule(colorName: string): string {
    const {color, fileType } = parseModuleName(colorName);
    switch(fileType) {
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
        default: // 'js'
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
    private compiler: Compiler;

    constructor({ compiler }: ProviderContext) {
        print('Custom Module Provider has started!');
        this.compiler = compiler;
    }

    async getModuleEntry({ specifier }: ResolverConfig): Promise<ModuleEntry | undefined> {
        // Modules handled by this provider have specifiers in this form: "color/{colorName}"
        if (specifier.startsWith(this.namespace)) {
            return {
                virtual: true, // ...because this is a server-generated module
                entry: `<virtual>/${specifier}${path.extname(specifier) ? '' : '.js'}`,
                specifier,
                version: this.version,
            };
        }
    }

    async getModuleSource({ namespace, name, version }: ModuleIdentifier): Promise<ModuleSource | undefined> {
        // Retrieve the Module Entry
        const specifier = getSpecifier({ namespace, name });
        const moduleEntry = await this.getModuleEntry({ specifier });
        if (!moduleEntry) {
            return;
        }

        // Generate code for the requested module
        const originalSource = generateModule(name);

        // Construct a Module Source object
        return {
            specifier,
            namespace,
            name,
            version,
            originalSource,
            moduleEntry,
            ownHash: hashContent(originalSource),
        };
    }

    async getModule(moduleId: ModuleIdentifier): Promise<CompiledModule | undefined> {
        // Get the Module Source
        const moduleSource = await this.getModuleSource(moduleId);
        if (!moduleSource) {
            return;
        }

        // Compile the module
        const { namespace, name } = moduleId;
        const compiledModule = await this.compiler.compileFile(moduleSource.originalSource, {
            // Remove #'s to avoid lwc syntax errors
            namespace,
            name: name.replace(/#/g, '_'),
            filename: moduleSource.moduleEntry.entry.replace(/#/g, '_'),
        });

        // Construct a Compiled Module
        const { color, fileType } = parseModuleName(name);
        print(`Color Module Provider returning ${fileType} code for color "${color}": ${moduleSource.originalSource}`);
        return {
            ...moduleSource,
            compiledModule,
        };
    }
}
