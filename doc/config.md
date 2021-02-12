# Configure a LWR Project

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Project Setup](#project-setup)
    -   [The LWR Server](#the-lwr-server)
    -   [Configuration](#configuration)
        -   [LWC Modules](#lwc-modules)
        -   [Routes](#routes)
        -   [Error Routes](#error-routes)
        -   [Assets](#assets)
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
        "lwr": "0.0.2-alpha51"
    }
}
```

Add any other project dependencies you need, such as client-side routing. See the [Simple Routing](https://github.com/salesforce/lwr-recipes/tree/master/packages/simple-routing) recipe for an example.

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

> Alternatively, you can pass the JSON configuration into [`createServer()`](#the-lwr-server). If you include both configurations, they are shallowly merged and the passed object takes precedence.

#### LWC Modules

To include LWC modules in your project, place LWC configuration inside `lwr.config.json`. See [Module Resolution](https://lwc.dev/guide/es_modules#module-resolution) for details.

```json
// lwr.config.json
{
    "lwc": {
        "modules": [{ "dir": "<rootDir>/src/modules" }, { "npm": "some-npm-package" }]
    }
}
```

> LWR automatically replaces any instances of `<rootDir>` with the path to the root directory of the LWR project.

#### Routes

Each server-side route includes these properties:

-   `id`: a unique identifier for the route
-   `path`: a unique URI path from which the route is served
-   `rootComponent`: the top-level LWC that LWR bootstraps into the HTML output for the route

```json
// lwr.config.json
{
    "routes": [
        {
            "id": "example",
            "path": "/",
            "rootComponent": "example/app"
        },
        {
            "id": "docs",
            "path": "/help",
            "rootComponent": "example/docs"
        }
    ]
}
```

> To learn how to work with client-side routes, see the [Simple Routing](https://github.com/salesforce/lwr-recipes/tree/master/packages/simple-routing) recipe.

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
            "rootComponent": "example/error"
        }
    ]
}
```

#### Assets

By default, LWR uses this configuration for assets.

```json
{
    "dir": "<rootDir>/src/assets",
    "urlPath": "/public/assets"
}
```

You can configure one or more files or directories to serve static assets in `lwr.config.json`. For each file or directory, include these properties:

-   `urlPath`: the URI path from which the asset(s) is served
-   `dir` or `file`: the file system path containing the asset(s)

```json
// lwr.config.json
{
    "assets": [
        {
            "dir": "<rootDir>/src/images",
            "urlPath": "/images"
        },
        {
            "file": "<rootDir>/logo.png",
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

#### More Configuration

LWR also offers the following configuration:

-   `port`: the port from which to serve the LWR application. The default is `process.env.PORT || 3000`.
-   `serverMode`: the mode in which the server should run. The default is `"dev"`. See available modes [here](./get_started.md#run-a-lwr-recipe). Typically, mode is set on the command line. See the `scripts` [package.json](./package.json).
-   `rootDir`: the root directory of the LWR project. The default is the current working directory (ie: `.`).
-   `cacheDir`: LWR caches LWC modules that it has compiled and stores them in a cache directory. The default is `"<rootDir>/__lwr_cache__"`.

```json
// lwr.config.json
{
    "port": 3333,
    "serverMode": "prod",
    "rootDir": "/Users/me/lwr/projects/awesome",
    "cacheDir": "<rootDir>/build/cache"
}
```
