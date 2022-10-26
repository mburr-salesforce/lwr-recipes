# @salesforce/featureFlag

-   [@salesforce/featureFlag](#@salesforce/featureFlag)
    -   [Introduction](#introduction)
    -   [Details](#details)
        -   [Project Setup](#project-setup)
        -   [flags.json](#flagsjson)
        -   [Configuration](#configuration)
    -   [Recipe Setup](#recipe-setup)

## Introduction

`@salesforce/featureFlag` is used to retrieve the current value of an access control. Feature Flag is a Salesforce scoped module that wraps an underlying access control such as a permission or preference. Feature flags can be used across containers, providing a single way for a component to consume an access control.

We will reuse concepts from the [Module Provider](https://github.com/salesforce-experience-platform/lwr-recipes/tree/main/packages/module-provider) example. If you have not reviewed that recipe previously, familiarize yourself with that code now.

## Details

An LWR Application is automatically set up with several default module providers. In this recipe, we create our own module provider to serve both org and user scoped feature flags and resolve their corresponding values within an LWC module.

While this recipe only shows the basic function of feature flags, they can be used as a very powerful tool to customize experiences with your own application.

### Project Setup

```text
src/
  ├── flags.json            // feature flag names and values
  ├── assets/
  │   └── styles/
  ├── layouts/
  │   └── main.html
  ├── modules/
  │   └── example/
  │       └── app/
  │           ├── app.css
  │           ├── app.html  // lightning-combobox of available feature flags
  │           └── app.js    // consumption of feature flags from module provider
  └── services/
      └── feature-flag-provider.ts
```

### flags.json

This file contains the definition of the feature flags and their corresponding values. Each feature area defines a feature flag within a given context - either for the entire organization or for an individual user. This file is initially read into a cache by the `feature-flag-provider` for quick retrieval. The `feature-flag-provider` returns a module which exports the feature flag value upon request.

```json
{
    "Lightning": {
        "org": {
            "orgWideFeature": true
        },
        "user": {
            "enabledFeature": true,
            "disabledFeature": false
        }
    }
}
```

### Configuration

In addition to the [Module Provider](https://github.com/salesforce-experience-platform/lwr-recipes/tree/main/packages/module-provider) example, we leverage the [base-slds](https://github.com/salesforce-experience-platform/lwr-recipes/tree/main/packages/base-slds) example by including Lightning Base Components. Our feature flag provider is also registered in this configuration file. See `lwr.config.json` and `package.json` properties below.

```json
// lwr.config.json
{
    "lwc": { "modules": [{ "dir": "$rootDir/src/modules" }, { "npm": "lightning-base-components" }] },
    "assets": [
        {
            "alias": "assetsDir",
            "dir": "$rootDir/src/assets",
            "urlPath": "/assets"
        }
    ],
    "routes": [
        {
            "id": "feature-flag",
            "path": "/",
            "rootComponent": "example/app",
            "layoutTemplate": "$layoutsDir/main.html",
            "bootstrap": {
                "syntheticShadow": true
            }
        }
    ],
    "moduleProviders": [
        "$rootDir/src/services/feature-flag-provider.ts",
        "@lwrjs/app-service/moduleProvider",
        "@lwrjs/lwc-module-provider",
        "@lwrjs/npm-module-provider"
    ]
}

// package.json
{
    "devDependencies": {
        "lightning-base-components": "^1.14.6-alpha"
    }
}
```

## Recipe Setup

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/feature-flag
yarn start # prod mode and ESM format
```

Open the site at [http://localhost:3000](http://localhost:3000)

See documentation for all commands [here](https://github.com/salesforce/lwr-recipes/blob/main/doc/get_started.md).
