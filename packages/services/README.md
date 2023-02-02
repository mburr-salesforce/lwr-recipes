# Using LWR Services

-   [Using LWR Services](#using-lwr-services)
    -   [Introduction](#introduction)
    -   [Details](#details)
        -   [Project Setup](#project-setup)
        -   [Configuration](#configuration)
    -   [Recipe Setup](#recipe-setup)
    -   [Heroku Deployment](#heroku-deployment)

## Introduction

The services recipe uses system-level modules to access services not available to standard or custom modules.

-   [Loader hooks](./src/modules/example/loaderHooks/loaderHooks.js) allow the client to handle the loading of modules before the app initializes so that they can be cached and returned from a local persistent cache.
    > Note: Loader hooks are an [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)-only feature.
-   [Module invalidation hooks](./src/modules/example/invalidationHook/invalidationHook.js) react to module fingerprint changes when that module is changed on the server.

## Details

### Project Setup

```text
src/
  ├── assets/
  │   └── styles.css
  ├── modules/
  │   └── example/
  │       └── app/
  │           ├── app.css
  │           ├── app.html
  │           └── app.js
  │       └── dynamic/            // system-level module to dynamically load components
  │       └── invalidationHook/   // system-level module for custom module invalidation hook
  │       └── loaderHooks/        // system-level module for custom loader hooks
  │       └── logger/             // system-level module to log exceptions
  └── index.ts
```

### Configuration

To enable loader hooks and module invalidation hooks for your app, add them to the list of bootstrap services in the app config. The `bootstrap.autoBoot` property is `true` by default, so set it to `false` to trigger custom initialization.

```json
// lwr.config.json
{
    "lwc": { "modules": [{ "dir": "$rootDir/src/modules" }] },
    "routes": [
        {
            "id": "services",
            "path": "/",
            "rootComponent": "example/app",
            "bootstrap": {
                "autoBoot": false,
                "services": ["example/loaderHooks", "example/invalidationHook"]
            }
        }
    ]
}
```

## Recipe Setup

Execute the following commands to build and run this recipe in `dev` mode.

```bash
yarn install
yarn build
yarn start
```

Open the site at [http://localhost:3000](http://localhost:3000).

See documentation for all commands [here](https://github.com/salesforce-experience-platform-emu/lwr-recipes/blob/main/doc/get_started.md).

## Heroku Deployment

```bash
# from the lwr-recipes root
./scripts/heroku-deploy.sh
```

The application would be deployed at [https://lwr-services.herokuapp.com/](https://lwr-services.herokuapp.com/)
