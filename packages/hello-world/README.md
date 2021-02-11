# Hello World Example

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Project Setup](#project-setup)
    -   [The LWR Server](#the-lwr-server)
    -   [Configuration](#configuration)
        -   [LWC Modules](#lwc-modules)
        -   [Routes](#routes)
        -   [Error Routes](#error-routes)
        -   [Assets](#assets)
        -   [Other Configuration](#other-configuration)
-   [Recipe Setup](#Recipe-setup)

## Introduction

The **Hello World** recipe is a barebones LWR Application. It contains the minimum code needed to get up and running.

## Details

### Project Setup

A typical directory structure for a basic JavaScript-based LWR project looks like this:

```
scripts/
  └── start-server.mjs  // create and start a LWR server
src/
  ├── assets/           // static assets (images, css, etc)
  │   └── logo.png
  └── modules/          // lwc modules
      └── namespace/
          └── name/
              ├── name.css
              ├── name.html
              └── name.js
lwr.config.json         // lwr configuration
package.json            // npm packaging configuration
```

### The LWR Server

To use LWR, include it and lwc as dependencies in _package.json_:

```json
// package.json
{
    "devDependencies": {
        "lwc": "~1.9.0",
        "lwr": "0.0.2-alpha51"
    }
}
```

Then write a script to create and start the LWR server:

```js
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

The LWR server is configured in _lwr.config.json_, at the root of the project.

_Note_: Alternatively, the JSON configuration object can be passed into [`createServer()`](#the-lwr-server). If **both** configurations are supplied, they are shallowly merged with the passed object taking precedence.

#### LWC Modules

Place lwc configuration inside _lwr.config.json_. Follow the format set forth by the lwc team [here](https://rfcs.lwc.dev/rfcs/lwc/0020-module-resolution).

```json
// lwr.config.json
{
    "lwc": {
        "modules": [{ "dir": "<rootDir>/src/modules" }, { "npm": "some-npm-package" }]
    }
}
```

_Note_: LWR will automatically replace any instances of `<rootDir>` with the path to the root directory of the LWR project.

#### Routes

Set up **server-side** routes, each with:

-   `id`: an identifier which must be unique within the application
-   `path`: the URI path from which the route will be served; must also be unique
-   `rootComponent`: the top-level lwc which LWR will bootstrap into the HTML output for the route

The **Hello World** recipe has one route, but more can be added:

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

_Note_: To see how to work with **client-side** routes, visit the [Simple Routing](https://github.com/salesforce/lwr-recipes/tree/master/packages/simple-routing) recipe.

#### Error Routes

Optionally set up routes which LWR will serve if there is a `404` or `500` error during bootstrap of a [route](#routes). The error routes do not take a `path`, but the `status` code for which the error route should be served:

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

One or more files or directories to serve static assets can be set in _lwr.config.json_, each with:

-   `urlPath`: the URI path from which the asset(s) should be served
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

The static assets can then be referenced in lwc templates:

```html
<template>
    <img src="/logo" alt="logo" />
    <img src="/images/home.png" alt="home" />
</template>
```

The **Hello World** recipe does not configure `assets` in [_lwr.config.json_](./lwr.config.json), and thus uses the default configuration provided by LWR:

```json
{
    "dir": "<rootDir>/src/assets",
    "urlPath": "/public/assets"
}
```

#### Other Configuration

LWR offers additional miscellaneous configuration, including:

-   `port`: the port from which to serve the LWR application; default: `process.env.PORT || 3000`
-   `serverMode`: the mode in which the server should run; see available modes [here](https://github.com/salesforce/lwr/tree/master/packages/%40lwrjs/core/runtime-configs); default: `"dev"`
    -   _Note_: typically, mode is set on the command line; see the `scripts` [package.json](./package.json)
-   `rootDir`: the root directory of the LWR project; default: current working directory (ie: `.`)
-   `cacheDir`: LWR caches lwc modules it has compiled and stores them in a cache directory; default: `"<rootDir>/__lwr_cache__"`

```json
// lwr.config.json
{
    "port": 3333,
    "serverMode": "prod",
    "rootDir": "/Users/me/lwr/projects/awesome",
    "cacheDir": "<rootDir>/build/cache"
}
```

## Recipe Setup

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/hello-world
yarn start # dev mode and ESM format
```

Open the site at [http://localhost:3000](http://localhost:3000)

See documentation for all commands [here](https://github.com/salesforce/lwr-recipes/blob/master/doc/getting_started.md).
