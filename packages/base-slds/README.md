# Using Salesforce Lightning Design System and Base Components

-   [Using Salesforce Lightning Design System and Base Components](#using-salesforce-lightning-design-system-and-base-components)
    -   [Introduction](#introduction)
    -   [Details](#details)
        -   [Project Setup](#project-setup)
        -   [Salesforce Lightning Design System](#salesforce-lightning-design-system)
        -   [Lightning Base Components](#lightning-base-components)
        -   [Configuration](#configuration)
    -   [Recipe Setup](#recipe-setup)
    -   [Heroku Deployment](#heroku-deployment)

## Introduction

This recipe explains how to include these resources from Salesforce:

-   [Salesforce Lightning Design System (SLDS)](https://www.lightningdesignsystem.com/getting-started/) for styling
-   [Lightning Base Components (LBC)](https://developer.salesforce.com/docs/component-library/overview/components) as a component library

## Details

### Project Setup

```
scripts/
  └── copy-resources.mjs // pull in SLDS resources
src/
  ├── assets/            // store SLDS resources
  ├── layouts/
  │   └── main.html      // link SLDS stylesheet
  ├── modules/           // app components
  ├── lwr.config.json    // configure SLDS and LBC
  ├── package.json       // create dependencies on SLDS and LBC
  └── index.ts           // LWR server startup script
```

### Salesforce Lightning Design System

These steps make the [Salesforce Lightning Design System (SLDS)](https://www.lightningdesignsystem.com/getting-started/) available in an LWR application:

1. Create a dependency on `@salesforce-ux/design-system` in [package.json](./package.json).

```json
// package.json
{
    "devDependencies": {
        "@salesforce-ux/design-system": "^2.11.6"
    }
}
```

2. Copy SLDS resources into the `/src/assets/` directory with [scripts/copy-resources](./scripts/copy-resources.mjs). This script is run during the [`lwr-recipes` build](#recipe-setup).

```js
import cpx from 'cpx';
cpx.copy('../../node_modules/@salesforce-ux/design-system/assets/**/*', 'src/assets', () => {
    console.log(`Done copying SLDS resources`);
});
```

3. Link to the SLDS stylesheets in the static layout template at [src/layouts/main.html](./src/layouts/main.html).

```html
<html>
    <head>
        <link rel="stylesheet" href="$assetsDir/styles/salesforce-lightning-design-system.css" />
    </head>
</html>
```

4. [Configure](#configuration) the application to handle the SLDS resources.

### Lightning Base Components

In order to use [Lightning Base Components (LBC)](https://developer.salesforce.com/docs/component-library/overview/components) in an LWR application:

1. Create a dependency on `lightning-base-components` in [package.json](./package.json).

```json
// package.json
{
    "devDependencies": {
        "lightning-base-components": "^1.16.6-alpha"
    }
}
```

2. Make the `npm` package available to the [LWC module provider](https://rfcs.lwc.dev/rfcs/lwc/0020-module-resolution) in [lwr.config.json](./lwr.config.json).

```json
{
    "lwc": {
        "modules": [{ "npm": "lightning-base-components" }]
    }
}
```

### Configuration

Configuration changes are required to support SLDS resources in the application:

-   The `syntheticShadow` property must be `true` to allow the SLDS stylesheet to function as **global** styles.
-   To allow the browser to access them, set up `/assets`, `/fonts` and `/lightning.utilitySprite` paths to SLDS stylesheets, fonts and images, respectively.

```json
// lwr.config.json
{
    "lwc": { "modules": [{ "dir": "$rootDir/src/modules" }, { "npm": "lightning-base-components" }] },
    "assets": [
        {
            "alias": "assetsDir",
            "dir": "$rootDir/src/assets",
            "urlPath": "/assets"
        },
        {
            "dir": "$rootDir/src/assets/fonts",
            "urlPath": "/fonts"
        },
        {
            "file": "$rootDir/src/assets/utilitySprite.svg",
            "urlPath": "/lightning.utilitySprite"
        }
    ],
    "routes": [
        {
            "id": "slds-base",
            "path": "/",
            "rootComponent": "example/app",
            "layoutTemplate": "$layoutsDir/main.html",
            "bootstrap": {
                "syntheticShadow": true
            }
        }
    ]
}
```

## Recipe Setup

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/base-slds
yarn start # prod mode and ESM format
```

Open the site at [http://localhost:3000](http://localhost:3000)

See documentation for all commands [here](https://github.com/salesforce-experience-platform-emu/lwr-recipes/blob/main/doc/get_started.md).

## Heroku Deployment

```bash
# from the lwr-recipes root
./scripts/heroku-deploy.sh
```

The application would be deployed at [https://lwr-base-slds.herokuapp.com/](https://lwr-base-slds.herokuapp.com/)
