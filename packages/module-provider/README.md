# Custom Module Provider

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Default module providers](#default-module-providers)
    -   [Create a module provider](#create-a-module-provider)
    -   [Module provider API](#module-provider-api)
        -   [ModuleProvider class](#moduleprovider-class)
        -   [getModuleEntry()](#getmoduleentry)
        -   [getModule()](#getmodule)
        -   [LWC module providers](#lwc-module-providers)
    -   [Configuration](#configuration)
        -   [Application configuration](#application-configuration)
        -   [Module provider configuration](#module-provider-configuration)
-   [Recipe](#Recipe)
    -   [Setup](#setup)
    -   [Crucial files](#crucial-files)

## Introduction

A large part of what LWR offers is resolving and serving modules for LWR Applications. LWR comes with several module providers out of the box, and a developer can also create their own _custom_ module providers. This documentation walks through the creation of two different types of module providers: [ECMAScript (ES)](https://nodejs.org/api/esm.html) modules and [LWC](https://lwc.dev/guide/introduction) modules.

For detailed design information, read the LWR Module Registry RFC and spec [here](https://rfcs.lwc.dev/rfcs/lws/0000-registry-v2#module-providers).

## Details

### Default module providers

An LWR Application is automatically set up with several default module providers:

-   LWC module provider ([source](https://github.com/salesforce/lwr/tree/master/packages/%40lwrjs/lwc-module-provider/src)): uses the [LWC module resolver](https://rfcs.lwc.dev/rfcs/lwc/0020-module-resolution) to locate and serve LWC modules from the file system
-   npm module provider ([source](https://rfcs.lwc.dev/rfcs/lwc/0020-module-resolution)): locates and serves modules from packages in the project's `node_modules` directories
-   Application bootstrap module provider ([source](https://github.com/salesforce/lwr/tree/master/packages/%40lwrjs/app-service/src/moduleProvider)): generates the [Application Bootstrap Module](https://rfcs.lwc.dev/rfcs/lws/0000-lwr-bootstrap#lwr-framework-client-resources)
-   Label module provider ([source](https://github.com/salesforce/lwr/tree/master/packages/%40lwrjs/label-module-provider/src)): pulls labels from JSON files and returns them as ES modules

### Create a module provider

Custom module providers can be stored in the LWR Application source. Here, they are stored in _/src/services/_:

```
node_modules/
src/
  ├── modules/
  ├── services/
  │   ├── custom-provider.ts
  │   └── another-custom-provider.ts
  └── index.ts
lwr.config.json
package.json
```

### Module provider API

Create a module provider by implementing the `ModuleProvider` interface provided by LWR.

#### ModuleProvider class

```ts

```

See a full LWC module provider example [here](./src/services/echo-provider.ts).

#### getModuleEntry()

```ts

```

#### getModule()

```ts

```

#### LWC module providers

[LWCs](https://lwc.dev/guide/es_modules) are special instances of ES modules which extend the `LightningElement` class. They must be processed by the LWC compiler before being served by a module provider. It is recommended that custom LWC module providers are created by extending the existing `LwcModuleProvider` class from `@lwrjs/lwc-module-provider.

The key is to override the `getModuleEntry()` and `getModuleSource()` functions, while deferring to the `getModule()` function of the superclass, which will take care of the LWC compilation:

```ts

```

See a full LWC module provider example [here](./src/services/color-provider.ts).

### Configuration

#### Application configuration

#### Module provider configuration

## Recipe

### Setup

```bash
# from the lwr-recipes root
yarn install
yarn build
cd module-provider
yarn start # dev mode and ESM format
```

Open the site at [http://localhost:3000](http://localhost:3000)

**Note**: Use `yarn start:amd` to run in compatibility mode and AMD format.

See documentation for all commands [here](https://github.com/salesforce/lwr-recipes#getting-started).

### Crucial files

-   custom ES module provider: [src/services/echo-provider.ts](./src/services/echo-provider.ts)
-   custom LWC module provider: [src/services/color-provider.ts](./src/services/color-provider.ts)
    -   **Note**: extends from `@lwrjs/lwc-module-provider` to handle LWC compilation
-   application configuration: [lwr.config.json](./lwr.config.json)
-   server creation: [src/index.ts](./src/index.ts)
-   lwc module directory: [src/modules/](./src/modules)
