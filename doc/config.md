# Configure a LWR Project

-   [Configure a LWR Project](#configure-a-lwr-project)
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
        -   [Packages](#packages)

## Introduction

Customize the project setup and server configuration for your LWR project.

## Details

### Project Setup

A typical directory structure for a basic JavaScript-based LWR project looks like this:

```text
src/
  ├── assets/           // static assets (images, css, etc)
  │   └── logo.png
  ├── content/          // content templates
  │   └── help.html
  ├── data/             // global data for content and layout templates
  │   └── global.json
  ├── layouts/          // layout templates
  │   ├── main.html
  │   └── site.njk
  └── modules/          // lwc modules
  │   └── namespace/
  │       └── name/
  │           ├── name.css
  │           ├── name.html
  │           └── name.js
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
        "lwc": "~2.5.8",
        "lwr": "0.6.0"
    }
}
```

Add any other project dependencies you need to `package.json`, such as client-side routing. See the [Simple Routing](https://github.com/salesforce/lwr-recipes/tree/main/packages/simple-routing) recipe for an example.

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

Or use the `lwr serve` CLI command to start your project.

```json
// package.json
{
    "name": "my-lwr-project",
    "scripts": {
        "dev": "lwr serve",
        "start": "lwr serve --mode prod",
        "start:compat": "lwr serve --mode compat",
        "start:prod-compat": "lwr serve --mode prod-compat"
    }
}
```

### Configuration

The LWR server is configured in `lwr.config.json`, at the root of the project.

> Alternatively, you can pass the JSON configuration into [`createServer()`](#the-lwr-server). If you include both configurations, they are shallowly merged and the passed object takes precedence. You may also dynamically alter the configuration at server startup using a [hook](https://github.com/salesforce/lwr-recipes/tree/main/packages/templating#hooks).

#### LWC Modules

To include LWC modules in your project, install the LWC package using `npm` and place LWC configuration inside `lwr.config.json`. See the [Base SLDS](https://github.com/salesforce/lwr-recipes/tree/main/packages/base-slds) recipe for an example using base LWCs and the Salesforce Lightning Design System.

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
        "lwr": "0.6.0"
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

See the [LWC documentation](https://github.com/salesforce/lwc/tree/main/packages/%40lwc/module-resolver#module-resolution) for more details on how LWC module resolution works.

#### Bundling

If a recipe is running in [`prod` or `prod-compat` mode](https://github.com/salesforce/lwr-recipes/blob/main/doc/get_started.md#run-a-lwr-recipe), LWR bundles modules before sending them to the client. Depending on your project setup, the same module dependency may get pulled into more than one bundle. This does not cause a problem for most modules, but some must be treated as singletons.

Examples of singleton modules are `lwc`, `lwr/navigation`, and `@lwc/synthetic-shadow`. Since these are framework modules, LWR automatically puts them into their own, shareable bundles. If an application contains additional singleton modules, exclude them from bundling as well:

```json
// lwr.config.json
{
    "bundleConfig": {
        "exclude": ["my/singleton", "do/notBundle"]
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
-   `routeHandler`: path to a [route handler](https://github.com/salesforce/lwr-recipes/tree/main/packages/templating#route-handler-params)
-   `cache`: cache settings for the routing, including:
    -   `ttl`: number, in seconds, or a [time string](https://github.com/vercel/ms#examples) to use as the `max-age` on the [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) header
-   `bootstrap`: specifies the client options that shape how an application page is bootstrapped. See an example in the [services](https://github.com/salesforce/lwr-recipes/blob/main/packages/services/lwr.config.json) recipe.
    -   `syntheticShadow`: set to `true` to turn on [lwc synthetic shadow](https://www.npmjs.com/package/@lwc/synthetic-shadow), default is `false`
    -   `services`: an array of lwc modules to run when the app is bootstrapping (i.e. on page load), see the [Metrics](https://github.com/salesforce/lwr-recipes/tree/main/packages/metrics#recipe-setup) and [Services](https://github.com/salesforce/lwr-recipes/tree/main/packages/services) recipes

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
            "cache": { "ttl": 60 },
            "bootstrap": {
                "syntheticShadow": true,
                "services": ["example/service", "example/loaderHooks"]
            }
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

> To learn how to work with templates and route handlers, see the [Templating](https://github.com/salesforce/lwr-recipes/tree/main/packages/templating) recipe. To learn how to work with client-side routes, see the [Simple Routing](https://github.com/salesforce/lwr-recipes/tree/main/packages/simple-routing) recipe.

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

> To see an error route example, see the [Templating](https://github.com/salesforce/lwr-recipes/tree/main/packages/templating) recipe.

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

The static assets can then be referenced in content or layout templates using the `alias`:

```html
<!-- /src/layouts/main.html -->
<html>
    <head>
        <link rel="icon" href="$imageDir/logo.svg" />
        <title>My Website</title>
    </head>
    <body>
        <!-- ... -->
    </body>
</html>
```

Or in LWC templates using the `urlPath`:

```html
<!-- /src/modules/my/component/component.html -->
<template>
    <img src="/logo" alt="logo" />
    <img src="/images/home.png" alt="home" />
</template>
```

#### Module Providers

LWR automatically includes a set of default module providers, so you don't need to list them in `lwr.config.json` unless your app requires one or more additional module providers. The `moduleProviders` array overwrites the default one provided by LWR, so you must list all module providers needed by the application, including those owned by LWR. The latest default module provider list is in the LWR source code [here](https://github.com/salesforce/lwr/blob/68c660a224d1a4f6e40a17d04aa2825be5cdd776/packages/%40lwrjs/core/src/env-config.ts#L47-L50).

```json
// lwr.config.json with a custom module provider, the Label Module Provider, and the LWR default module providers
{
    "moduleProviders": [
        "$rootDir/src/services/my-module-provider.ts",
        "@lwrjs/label-module-provider",
        "@lwrjs/app-service/moduleProvider",
        "@lwrjs/lwc-module-provider",
        "@lwrjs/npm-module-provider"
    ]
}
```

For more examples, see the [Module Provider](https://github.com/salesforce/lwr-recipes/tree/main/packages/module-provider) and [Labels](https://github.com/salesforce/lwr-recipes/tree/main/packages/labels) recipes.

#### More Configuration

LWR also offers the following optional configuration:

-   `port`: The port from which to serve the LWR application. The default is `process.env.PORT || 3000`.
-   `serverMode`: The mode in which the server should run. The default is `"dev"`. See available modes [here](./get_started.md#run-a-lwr-recipe). Typically, mode is set on the command line. See the `scripts` [package.json](./package.json).
-   `serverType`: The type of underlying web server LWR should utilize. Supported values are `"express"`(default) || `"koa"` but more server types may be supported in the future.
-   `rootDir`: The root directory of the LWR project. The default is the current working directory (ie: `.`).
-   `cacheDir`: LWR caches LWC modules that it has compiled and stores them in a cache directory. The default is `"$rootDir/__lwr_cache__"`.
-   `contentDir`: The content templates directory. The default is `"$rootDir/src/content"`.
-   `layoutsDir`: The layout templates directory. The default is `"$rootDir/src/layouts"`.
-   `globalDataDir`: The directory of [global data](https://github.com/salesforce/lwr-recipes/tree/main/packages/templating#global-data) for templating. The default is `"$rootDir/src/data"`.
-   `hooks`: A list of configuration hooks, used to dynamically alter the LWR Configuration at server startup. See more information in the [templating recipe](https://github.com/salesforce/lwr-recipes/tree/main/packages/templating#hooks).
-   `locker`: Allows you to enable [Lightning Locker](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/security_code.htm) and optionally configure a list of trusted components. By default, locker is disabled. If locker is on, components from LWC and LWR are automatically trusted. See the locker recipe [here](https://github.com/salesforce/lwr-recipes/tree/main/packages/locker).

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
    "globalDataDir": "$rootDir/src/templateContext",
    "hooks": ["$rootDir/src/hooks/docs-app-hooks.js"],
    "locker": {
        "enabled": true,
        "trustedComponents": ["my/trustedCmp"]
    }
}
```

### Packages

The following table maps available LWR packages to recipes so you can see how they're used. If the package is a module provider, add it to the list of module providers in `lwr.config.json`.

| Package Name          | Description                                                                   | Is Module Provider? | Recipes that Use Package                                                                                                                                                                                                                                                                                          |
| --------------------- | ----------------------------------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| label-module-provider | Pulls labels from JSON files and returns them as ES modules for localization  | Yes                 | [labels](https://github.com/salesforce/lwr-recipes/tree/main/packages/labels)                                                                                                                                                                                                                                     |
| router                | Uses the router API to add navigation capabilities to your app                | No                  | [nested routing](https://github.com/salesforce/lwr-recipes/tree/main/packages/nested-routing), [simple routing](https://github.com/salesforce/lwr-recipes/tree/main/packages/simple-routing), [routing-extended-metadata](https://github.com/salesforce/lwr-recipes/tree/main/packages/routing-extended-metadata) |
| shared-utils          | Helpers used for advanced functionality, like writing custom module providers | No                  | [module provider](https://github.com/salesforce/lwr-recipes/tree/main/packages/module-provider)                                                                                                                                                                                                                   |
