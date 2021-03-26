# Configure a LWR Project

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Project Setup](#project-setup)
    -   [The LWR Server](#the-lwr-server)
    -   [Configuration](#configuration)
        -   [LWC Modules](#lwc-modules)
        -   [Bundling](#bundling)
        -   [Routes](#routes)
        -   [Error Routes](#error-routes)
        -   [Assets](#assets)
        -   [Module Providers](#module-providers)
        -   [More Configuration](#more-configuration)

## Introduction

Customize the project setup and server configuration for your LWR project.

## Details

### Project Setup

A typical directory structure for a basic JavaScript-based LWR project looks like this:

```
src/
  ├── assets/           // static assets (images, css, etc)
  │   └── logo.png
  └── modules/          // lwc modules
      └── namespace/
          └── name/
              ├── name.css
              ├── name.html
              └── name.js
  └── index.ts          // create and start a LWR server
lwr.config.json         // lwr configuration
package.json            // npm packaging configuration
```

### The LWR Server

To use LWR, include it and LWC as dependencies in `package.json`.

```json
// package.json
{
    "devDependencies": {
        "lwc": "~1.9.0",
        "lwr": "0.1.7"
    }
}
```

Add any other project dependencies you need to `package.json`, such as client-side routing. See the [Simple Routing](https://github.com/salesforce/lwr-recipes/tree/master/packages/simple-routing) recipe for an example.

Then write a script to create and start the LWR server.

```js
// src/index.ts
import { createServer } from 'lwr';

createServer()
    .listen(({ port, serverMode }) => {
        // Success callback
        console.log(`Lwr Application listening on port ${port} in ${serverMode} mode\n`);
    })
    .catch((e) => {
        // Error callback
        console.error(e);
        process.exit(1);
    });
```

### Configuration

The LWR server is configured in `lwr.config.json`, at the root of the project.

> Alternatively, you can pass the JSON configuration into [`createServer()`](#the-lwr-server). If you include both configurations, they are shallowly merged and the passed object takes precedence. You may also dynamically alter the configuration at server startup using a [hook](https://github.com/salesforce/lwr-recipes/tree/master/packages/templating#hooks).

#### LWC Modules

To include LWC modules in your project, install the LWC package using `npm` and place LWC configuration inside `lwr.config.json`. See the [Base SLDS](https://github.com/salesforce/lwr-recipes/tree/master/packages/base-slds) recipe for an example using base LWCs and the Salesforce Lightning Design System.

```bash
npm install lightning-base-components --save
```

The `package.json` now includes the `lightning-base-components` package.

```json
// package.json
{
    "devDependencies": {
        "lightning-base-components": "^1.9.0-alpha",
        "lwc": "~1.9.0",
        "lwr": "0.1.7"
    }
}
```

The `lwc.modules` key in `lwr.config.json` accepts an array of module records from these sources:

-   **Alias module record:** A file path where a module can be resolved.
-   **Directory module record:** A folder path where modules can be resolved.
-   **NPM package module record:** An NPM package that exposes one or more modules.

```json
// lwr.config.json
{
    "lwc": {
        "modules": [
            {
                "name": "ui/button",
                "path": "src/modules/ui/button/button.js"
            },
            {
                "dir": "$rootDir/src/modules"
            },
            {
                "npm": "lightning-base-components"
            }
        ]
    }
}
```

The resolver iterates through the modules array and returns the first module that matches the requested module specifier. LWR automatically replaces any instances of `$rootDir` with the path to the root directory of the LWR project.

See the [LWC documentation](https://github.com/salesforce/lwc/tree/master/packages/%40lwc/module-resolver#module-resolution) for more details on how LWC module resolution works.

#### Bundling

If a recipe is running in [`prod` mode](https://github.com/salesforce/lwr-recipes/blob/master/doc/get_started.md#run-a-lwr-recipe), LWR bundles modules before sending them to the client. Depending on your project setup, the same module dependency may get pulled into more than one bundle. This does not cause a problem for most modules, but some must be treated as singletons. Examples of such modules are `lwc`, `lwr/navigation`, and `@lwc/synthetic-shadow`.

The solution is to put these modules in their own, shareable bundles:

```json
// lwr.config.json
{
    "bundleConfig": {
        "exclude": ["lwc", "lwr/navigation"]
    }
}
```

#### Routes

Each server-side route includes these properties:

-   `id` (**required**): unique identifier for the route
-   `path` (**required**): unique URI path from which the route is served
-   `rootComponent`: top-level LWC that LWR bootstraps into the HTML output for the route. Each route must have either a `rootComponent` or a `contentTemplate`, but not both.
-   `contentTemplate`: path to a static template which renders page content
-   `layoutTemplate`: path to a static template which renders a page layout
-   `properties`: JSON object which gets passed to the templates as context
-   `routeHandler`: path to a [route handler](https://github.com/salesforce/lwr-recipes/tree/master/packages/templating#route-handler-params)
-   `cache`: cache settings for the routing, including:
    -   `ttl`: number, in seconds, or a [time string](https://github.com/vercel/ms#examples) to use as the `max-age` on the [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) header

```json
// lwr.config.json
{
    "routes": [
        {
            "id": "example",
            "path": "/",
            "rootComponent": "example/app",
            "layoutTemplate": "$layoutsDir/main.html",
            "properties": { "staticParam": "This is the Home page" },
            "cache": { "ttl": 60 }
        },
        {
            "id": "docs",
            "path": "/help",
            "contentTemplate": "$contentDir/readme.md",
            "routeHandler": "$rootDir/src/routeHandlers/docs.js",
            "cache": { "ttl": "7d" }
        }
    ]
}
```

> To learn how to work with templates and route handlers, see the [Templating](https://github.com/salesforce/lwr-recipes/tree/master/packages/templating) recipe. To learn how to work with client-side routes, see the [Simple Routing](https://github.com/salesforce/lwr-recipes/tree/master/packages/simple-routing) recipe.

#### Error Routes

Optionally, set up routes that LWR serves if a `404` or `500` error is encountered during bootstrap of a route. The error routes take a `status` code for the error route instead of a `path`.

```json
// lwr.config.json
{
    "errorRoutes": [
        {
            "id": "not_found",
            "status": 404,
            "rootComponent": "example/notFound"
        },
        {
            "id": "server_error",
            "status": 500,
            "contentTemplate": "$contentDir/not-found.html"
        }
    ]
}
```

> To see an error route example, see the [Templating](https://github.com/salesforce/lwr-recipes/tree/master/packages/templating) recipe.

#### Assets

By default, LWR uses this configuration for assets.

```json
{
    "alias": "assetsDir",
    "dir": "$rootDir/src/assets",
    "urlPath": "/public/assets"
}
```

You can configure one or more files or directories to serve static assets in `lwr.config.json`. For each file or directory, include these properties:

-   `alias`: a name for this path to use in content/layout templates
-   `urlPath`: the URI path from which the asset(s) is served
-   `dir` or `file`: the file system path containing the asset(s)

```json
// lwr.config.json
{
    "assets": [
        {
            "alias": "imageDir",
            "dir": "$rootDir/src/images",
            "urlPath": "/images"
        },
        {
            "file": "$rootDir/logo.png",
            "urlPath": "/logo"
        }
    ]
}
```

The static assets can then be referenced in LWC templates:

```html
<template>
    <img src="/logo" alt="logo" />
    <img src="/images/home.png" alt="home" />
</template>
```

#### Module Providers

LWR automatically includes a set of default module providers, so you don't need to list them in `lwr.config.json` unless your app requires one or more additional module providers. The `moduleProviders` array overwrites the default one provided by LWR, so you must list all module providers needed by the application, including those owned by LWR. The latest default module provider list is in the LWR source code [here](https://github.com/salesforce/lwr/blob/68c660a224d1a4f6e40a17d04aa2825be5cdd776/packages/%40lwrjs/core/src/env-config.ts#L47-L50).

```json
// lwr.config.json with the Label Module Provider and the LWR default module providers
{
    "moduleProviders": [
        "@lwrjs/label-module-provider",
        "@lwrjs/app-service/moduleProvider",
        "@lwrjs/lwc-module-provider",
        "@lwrjs/npm-module-provider"
    ]
}
```

To see a list of module providers not included by default, see [Available Packages](./business_overview.md#available-packages) in the LWR business overview.

#### More Configuration

LWR also offers the following optional configuration:

-   `port`: the port from which to serve the LWR application. The default is `process.env.PORT || 3000`.
-   `serverMode`: the mode in which the server should run. The default is `"dev"`. See available modes [here](./get_started.md#run-a-lwr-recipe). Typically, mode is set on the command line. See the `scripts` [package.json](./package.json).
-   `serverType`: the type of underlying web server LWR should utilize. Supported values are `"express"`(default) || `"koa"` but more server types may be supported in the future.
-   `rootDir`: the root directory of the LWR project. The default is the current working directory (ie: `.`).
-   `cacheDir`: LWR caches LWC modules that it has compiled and stores them in a cache directory. The default is `"$rootDir/__lwr_cache__"`.
-   `contentDir`: the content templates directory. The default is `"$rootDir/src/content"`.
-   `layoutsDir`: the layout templates directory. The default is `"$rootDir/src/layouts"`.
-   `globalDataDir`: the directory of [global data](https://github.com/salesforce/lwr-recipes/tree/master/packages/templating#global-data) for templating. The default is `"$rootDir/src/data"`.

```json
// lwr.config.json
{
    "port": 3333,
    "serverMode": "prod",
    "serverType": "express",
    "rootDir": "/Users/me/lwr/projects/awesome",
    "cacheDir": "$rootDir/build/cache",
    "contentDir": "$rootDir/templates",
    "layoutsDir": "$rootDir",
    "globalDataDir": "$rootDir/src/templateContext"
}
```
