# Extended Metadata for Routing

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Extending Route Metadata](#extending-route-metadata)
    -   [Current Route Metadata Context Wire](#current-route-metadata-context-wire)
    -   [Configuration](#configuration)
-   [Recipe Setup](#Recipe-setup)

## Introduction

This recipe demonstrates how to add metadata to route definitions and how developers can use that data in pre/postNavigate hooks or within components. While this recipe stands alone, the [simple routing recipe](../simple-routing) may be useful to review first if you are not familiar with how routing works in LWR.

## Details

### Extending Route Metadata

In `example/currentRouteMetadata` new types are created which make metadata mandatory and specify a specific type for the metadata. In this recipe, each route definition must have mandatory metadata fields `isPublic`, `devName` and `label`. These new types are used in `example/rootRouter` when defining routes.

```
build/
node_modules/
src/
  ├── assets/
  ├── modules/example/
  │   ├── app/
  │   ├── contextUtils/
  │   └── currentRouteMetadata/
  │       └── currentRouteMetadata.ts           // extended types and wire adapter
  │   └── metadataPageAttributeApplier/
  │       └── metadataPageAttributeApplier.ts   // usage of CurrentRouteMetadata wire
  │   └── rootRouter/
  │       └── rootRouter.ts                     // route definition configuration
  ├── services/
  │   ├── es-custom-provider.ts
  │   └── lwc-custom-provider.ts
  └── index.ts
lwr.config.json
package.json
```

### Current Route Metadata Context Wire

In order to get the current route metadata into a component, a context wire is used. There are a few different pieces to this:

-   Utility classes are provided in `example/contextUtils` for working with context wires and creating wire adapters
-   A new context wire is created in `example/currentRouteMetadata` for working with metadata.
-   After the `example/app` component is connected, it provides context indicating it will provide the value of current route metadata to its children.
-   Also in `example/app`, when the postNavigate hook is called, the value of current route metadata is set.
-   The `example/metadataPageAttributeApplier` component gets the updated wire value with the metadata and transforms it into an easy to iterate value so it can be displayed on the page.

### Configuration

The only configuration for this app is the location of the modules directory and the configuration of two server-side routes so the routes can be loaded by both the client and the server.

```json
{
    "lwc": { "modules": [{ "dir": "<rootDir>/src/modules" }] },
    "routes": [
        {
            "id": "routing-extended-metadata",
            "path": "/",
            "rootComponent": "example/app"
        },
        {
            "id": "named-page",
            "path": "/:namedPage",
            "rootComponent": "example/app"
        }
    ]
}
```

## Recipe Setup

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/routing-extended-metadata
yarn start # dev mode and ESM format
```

Open the site at [http://localhost:3000](http://localhost:3000)

See documentation for all commands [here](https://github.com/salesforce/lwr-recipes/blob/master/README.md#getting-started).
