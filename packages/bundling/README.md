# Bundling Example

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Configuration](#configuration)
    -   [Example](#example)
-   [Recipe Setup](#recipe-setup)

## Introduction

Bundling is a common app framework feature that allows applications to optimize the delivery of JavaScript bundles to the client to improve performance. While LWR's default bundling is sufficient for most use cases, you may want more control to further optimize performance.

This recipe demonstrates how to customize bundling for your application through configuration.

## Details

### Configuration

To customize bundling for your application, you must specify the `bundleConfig` property and one or more optional bundling features.

See [bundling config documentation](../../doc/config.md) for more details.

Note: if you want LWR's default bundling behavior, just delete the `bundleConfig` property from your `lwr.config.json`.

```json
// lwr.config.json
{
    "lwc": { "modules": [{ "dir": "$rootDir/src/modules" }] },
    "bundleConfig": {
        "exclude": ["example/example"],
        "groups": {
            "shared": ["lwc", "example/log"]
        }
    },
    "routes": [
        {
            "id": "example",
            "path": "/",
            "rootComponent": "example/app"
        }
    ]
}
```

#### Example

The following represents the module dependency graph for the `example/app` root component.

```
        example/app
        /    |     \
       /     |      \
    lwc  example/   example/log
            example
             |
             |
            lwc
```

By default (i.e. no custom bundling configuration), LWR will create a single JavaScript bundling containing the entire dependency graph (however, LWR excludes `lwc` by default).

To change/customize the default, the `bundleConfig.exclude` configuration in this recipe excludes `example/example`, creating another JavaScript bundle containing only that module. Additionally, the `bundleConfig.groups` configuration creates a bundling group named `shared` containing `lwc` and `example/log`.

See [Recipe Setup](#recipe-setup) below to see the example in action.

## Recipe Setup

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/bundling
```

Note that some bundling features behave differently depending on the module formatl. Use the appropriate start command depending on your desired module format:

```bash
yarn start:amd # prod-compat mode and AMD format
```

Starting this recipe in AMD production mode (`prod-compat` mode) will demonstrate `bundleConfig.exclude` and `bundleConfig.groups` features.

```bash
yarn start # prod mode and ESM format
```

Starting this recipe in ESM production mode (`prod` mode) will demonstrate `bundleConfig.exclude` but not `bundleConfig.groups` feature, since it is not yet supported in ESM mode.
