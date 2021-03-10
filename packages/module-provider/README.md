# Custom Module Provider

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Default module providers](#default-module-providers)
    -   [Create a module provider](#create-a-module-provider)
    -   [Module provider API](#module-provider-api)
        -   [`ModuleProvider` class](#moduleprovider-class)
        -   [`getModuleEntry()`](#getmoduleentry)
        -   [`getModule()`](#getmodule)
        -   [LWC module providers](#lwc-module-providers)
    -   [Configuration](#configuration)
        -   [Application configuration](#application-configuration)
        -   [Module provider configuration](#module-provider-configuration)
-   [Recipe Setup](#Recipe-setup)

## Introduction

A large part of what LWR offers is resolving and serving modules for LWR Applications. LWR can serve both [ECMAScript (ES)](https://nodejs.org/api/esm.html) modules and [LWC](https://lwc.dev/guide/introduction) modules. LWR comes with several module providers out of the box, and a developer can also create their own _custom_ module providers.

This documentation walks through the creation of two different types of module providers: [ES](#moduleprovider-class) and [LWC](#lwc-module-providers).

For detailed design information, read the LWR Module Registry RFC and spec [here](https://rfcs.lwc.dev/rfcs/lws/0000-registry-v2#module-providers).

## Details

### Default module providers

An LWR Application is automatically set up with several default module providers:

-   LWC module provider ([source](https://github.com/salesforce/lwr/tree/master/packages/%40lwrjs/lwc-module-provider/src)): uses the [LWC module resolver](https://rfcs.lwc.dev/rfcs/lwc/0020-module-resolution) to locate and serve LWC modules from the file system
-   npm module provider ([source](https://github.com/salesforce/lwr/tree/master/packages/%40lwrjs/npm-module-provider/src)): locates and serves ES modules from packages in the project's `node_modules` directories
-   Application bootstrap module provider ([source](https://github.com/salesforce/lwr/tree/master/packages/%40lwrjs/app-service/src/moduleProvider)): generates the ES [Application Bootstrap Module](https://rfcs.lwc.dev/rfcs/lws/0000-lwr-bootstrap#lwr-framework-client-resources)

### Create a module provider

Custom module providers can be stored in a LWR Application's source. Here, they are stored in _/src/services/_:

```
build/                              // holds ts -> js transpiled files
node_modules/
src/
  ├── modules/
  ├── services/
  │   ├── es-custom-provider.ts
  │   └── lwc-custom-provider.ts
  └── index.ts
lwr.config.json
package.json
```

### Module provider API

The following sections go over each part of a module provider.

#### `ModuleProvider` class

Create an ES module provider by implementing the `ModuleProvider` interface provided by LWR. Give the module provider a `name`.

```ts
// src/services/es-custom-provider.ts
import { ModuleProvider } from 'lwr';
export default class MyProvider implements ModuleProvider {
    name = 'echo-provider';
    private version = '1'; // not required, but useful
}
```

See a full ES module provider example [here](./src/services/echo-provider.ts).

##### getModuleEntry()

A LWR server contains a [module registry](https://rfcs.lwc.dev/rfcs/lws/0000-registry-v2#registry), which is in charge of fulfilling module requests. The module registry maintains a list of the available module providers. When a module request comes in, the module registry delegates to its module providers by calling `getModuleEntry()` on each one. This function receives two arguments:

-   a module ID, which contains the module `specifier`
-   `RuntimeParams`, a `Record<string, string | number | boolean | null | undefined>` map of information specific to the request (eg: `locale`)

If a module provider can handle the request, it returns a `ModuleEntry` object, which contains:

-   `id`: The module registry uses this as part of the cache key for the module, so include all information which makes this module unique. At a minimum, include the `specifer` and module provider `version`. If the module is locale-specific, add the `locale` value from the `RuntimeParams`.
-   `virtual`: Set to `true` if module code from this provider is generated (ie: not read off a file system, database, etc)
-   `entry`: The file path to the module. If the module is virtual, create a path based on the `specifier`.
-   `specifier`: Reuse the argument which was passed into `getModuleEntry()`
-   `version`: The version of the module provider

```ts
import { AbstractModuleId, ModuleCompiled, ModuleEntry, ModuleProvider, RuntimeParams } from 'lwr';

// Return true if the given specifier is handled by this module provider
function canHandle(specifier: string): boolean {
    // For example: this module provider checks for a namespace of "@my"
    return specifier.startsWith('@my/');
}

export default class MyProvider implements ModuleProvider {
    async getModuleEntry(
        { specifier }: AbstractModuleId,
        runtimeParams: RuntimeParams = {},
    ): Promise<ModuleEntry | undefined> {
        if (canHandle(specifier)) {
            return {
                id: `${specifier}|${this.version}`,
                virtual: true,
                entry: `<virtual>/${specifier}.js`,
                specifier,
                version: this.version,
            };
        }
    }
}
```

##### getModule()

If the module registry determines that a module provider can fulfill a request, it will call `getModule()`, which receives the same arguments as [`getModuleEntry()`](#getmoduleentry). Though this function returns a `ModuleCompiled`, the module provider does **not** need to compile ES modules.

```ts
import { AbstractModuleId, ModuleCompiled, ModuleEntry, ModuleProvider, RuntimeParams } from 'lwr';
import { hashContent } from '@lwrjs/shared-utils';

// Return a generated ES code string
function generateModule(specifier: string): string {
    return `...`;
}

export default class MyProvider implements ModuleProvider {
    async getModule(
        { specifier, namespace, name }: AbstractModuleId,
        runtimeParams: RuntimeParams = {},
    ): Promise<ModuleCompiled | undefined> {
        // Retrieve the Module Entry
        const moduleEntry = await this.getModuleEntry({ specifier });
        if (!moduleEntry) {
            return;
        }

        // Generate code for the requested ES module
        const originalSource = generateModule(message);

        // Construct a Module object
        return {
            id: moduleEntry.id,
            specifier,
            namespace,
            name,
            version: this.version,
            originalSource,
            moduleEntry,
            ownHash: hashContent(originalSource),
            // Note: there is no need to compile this module
            // The module registry will compile ES code, if needed
            compiledSource: originalSource,
        };
    }
}
```

_Note_: Add `"@lwrjs/shared-utils"` as a dependency in _package.json_.

#### LWC module providers

[LWCs](https://lwc.dev/guide/es_modules) are special instances of ES modules which extend the `LightningElement` class. They must be processed by the LWC compiler before being served by a module provider. It is recommended that custom LWC module providers are created by extending the existing `LwcModuleProvider` class from `@lwrjs/lwc-module-provider`.

The key is to override the `getModuleEntry()` and `getModuleSource()` functions, while deferring to the `getModule()` function of the superclass, which will take care of the LWC compilation:

```ts
// src/services/lwc-custom-provider.ts
import path from 'path';
import LwcModuleProvider from '@lwrjs/lwc-module-provider'; // add to package.json dependencies
import {
    AbstractModuleId,
    FsModuleEntry,
    ModuleCompiled,
    ModuleEntry,
    ModuleProvider,
    ModuleSource,
} from 'lwr';
import { hashContent } from '@lwrjs/shared-utils';

// Return generated LWC code strings by file type: html, css or default js
function generateModule(specifier: string): string {
    const fileType = path.extname(specifier).substr(1);
    switch (fileType) {
        case 'html':
            return `<template><!-- HTML code --></template>`;
        case 'css':
            return `/* CSS code */`;
        default:
            // 'js'
            return `
import { LightningElement } from 'lwc';
export default class MyLwc extends LightningElement { /* LWC code */ }`;
    }
}

export default class MyLwcProvider extends LwcModuleProvider implements ModuleProvider {
    name = 'lwc-provider';
    private version = '1';

    async getModuleEntry({ specifier }: AbstractModuleId): Promise<FsModuleEntry | undefined> {
        if (canHandle(specifier)) {
            return {
                id: `${specifier}|${this.version}`,
                // Incoming specifiers may be html or css code
                // Ensure the entry file extension matches:
                entry: `<virtual>/${specifier}${path.extname(specifier) ? '' : '.js'}`,
                specifier,
                version: this.version,
            };
        }
    }

    getModuleSource(
        { name, namespace, specifier }: AbstractModuleId,
        moduleEntry: ModuleEntry,
    ): ModuleSource {
        const originalSource = generateModule(specifier);
        return {
            id: moduleEntry.id,
            specifier,
            namespace,
            name: name || specifier,
            version: moduleEntry.version,
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
```

See a full LWC module provider example [here](./src/services/color-provider.ts).

### Configuration

Learn more in [Configure a LWR Project](../../doc/config.md).

#### Application configuration

Register a custom module provider by adding it to _lwr.config.json_. Make sure Typescript has been transpiled into JavaScript.

```json
// lwr.config.json
{
    "moduleProviders": [
        "$rootDir/build/services/es-custom-provider.js",
        "$rootDir/build/services/lwc-custom-provider.js",
        "@lwrjs/app-service/moduleProvider",
        "@lwrjs/lwc-module-provider",
        "@lwrjs/npm-module-provider"
    ]
}
```

_Note_: The `moduleProviders` array overwrites the default one provided by LWR, so **all** module providers needed by the application must be listed, including those owned by LWR. The latest default module provider list is in the LWR source code [here](https://github.com/salesforce/lwr/blob/68c660a224d1a4f6e40a17d04aa2825be5cdd776/packages/%40lwrjs/core/src/env-config.ts#L47-L50).

#### Module provider configuration

Configuration can be passed from _lwr.config.json_ to a module provider constructor. The configuration can be any JSON object or primitive type. For example:

```json
// lwr.config.json
{
    "moduleProviders": [
        [
            "$rootDir/build/services/provider-with-config.js",
            {
                "cache": true,
                "locales": ["en", "es", "de"]
            }
        ]
    ]
}
```

The configuration is passed into the module provider constructor, along with [`ProviderContext`](https://github.com/salesforce/lwr/blob/68c660a224d1a4f6e40a17d04aa2825be5cdd776/packages/%40lwrjs/types/src/index.ts#L327) from the LWR server.

```ts
// src/services/provider-with-config.ts
interface MyProviderOptions {
    cache?: boolean;
    locales?: string[];
}
export default class MyProvider implements ModuleProvider {
    constructor(context: ProviderContext, { cache = true, locales = [] }: MyProviderOptions) {
        // initialization
    }
}
```

## Recipe Setup

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/module-provider
yarn start # dev mode and ESM format
```

Open the site at [http://localhost:3000](http://localhost:3000)

See documentation for all commands [here](https://github.com/salesforce/lwr-recipes/blob/master/doc/get_started.md).
