# Lightning Locker Support

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Lightning Locker Configuration](#lightning-locker-configuration)
-   [Recipe](#Recipe)
    -   [Setup](#setup)
    -   [Crucial files](#crucial-files)

## Introduction

Shows you how to enable and configure Lightning Locker for an LWR App.

## Details

[Lightning Locker](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/security_code.htm) is a powerful security architecture for Lightning components. Lightning Locker enhances security by isolating Lightning components that belong to one namespace from components in a different namespace. Lightning Locker also promotes best practices that improve the supportability of your code by only allowing access to supported APIs and eliminating access to non-published framework internals.

### Lightning Locker Configuration

To enable Lightning Locker add the locker config to a bootstrap configuration for a route. Any components or namespaces you want to run outside of locker, list in the `trustednamespaces` property.

```ts
{
    "lwc": {
        "modules": [{ "dir": "<rootDir>/src/modules" }]
    },
    "routes": [
        {
            "id": "locker-base",
            "path": "/",
            "rootComponent": "example/app",
            "layoutTemplate": "<layoutsDir>/main.html",
            "bootstrap": {
                "locker": {
                    "enabled": true,
                    "trustedNamespaces": ["lightning", "example/app", "example/trustedCmp"]
                }
            }
        }
    ]
}
```

## Recipe

### Setup

Use the following command to build this recipe.

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/locker
yarn start:amd # locker is currently not supported in ESM
```

Open the site at [http://localhost:3000](http://localhost:3000)

See documentation for all commands [here](https://github.com/salesforce/lwr-recipes/blob/master/doc/getting_started.md).

### Crucial files

-   server creation: [src/index.ts](./src/index.ts)
-   application configuration: [lwr.config.json](./lwr.config.json)
-   lwc module directory: [src/modules/](./src/modules)
-   layout templates: [src/layouts/](./src/layouts)
