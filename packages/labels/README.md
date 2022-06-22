# Localizing an Application with Labels

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Project Setup](#project-setup)
    -   [Configuration](#configuration)
    -   [Importing Labels into Your Component](#importing-labels-into-your-component)
-   [Recipe Setup](#recipe-setup)
-   [Heroku Deployment](#heroku-deployment)

## Introduction

Localization is an important requirement when building most web applications. This recipe uses the Label Module Provider to translate the greeting text on your LWR app's homepage into various languages. The Label Module Provider serves file-based labels in your app as ES modules based on the locale, allowing you to import translatable text into your components and avoid hardcoding. The locale is determined with the following precedence:

1. `locale` path parameter in the request
2. `Accept-Language` header in the request
3. The default locale set by the runtime

## Details

### Project Setup

Add labels as json files, with a file per supported locale. The filenames are expected to be the locale code of the corresponding labels. If the Label Module Provider can't find a label file for a specific country, it uses the 2-letter locale files as fallback. For example, if the label file for `fr-FR` isn't found, it uses `fr`. All the locale files for a set of labels must be in the same directory. For example:

```
src/
  ├── assets/
  ├── labels/
  │   ├── en.json       // English
  │   ├── es.json       // Spanish
  │   ├── it.json       // Italian
  │   └── fr-FR.json    // French (France)
  ├── modules/
  └── index.ts
lwr.config.json
```

Each file contains a JSON object with the label references and values nested by namespace. For example, the label `@my/label/home.greeting` is added to the file as:

```json
{
    "home": {
        "greeting": "Hello"
    }
}
```

### Configuration

Label Module Provider is not a default provider, so you must add it to your project configuration. Learn more in [Configure a LWR Project](../../doc/config.md#module-providers).

Add `"@lwrjs/label-module-provider" as a dependency in `package.json`.

```json
// package.json
{
    "dependencies": {
        "@lwrjs/label-module-provider": "0.7.1",
        "lwc": "1.17.0",
        "lwr": "0.7.1"
    }
}
```

Register the Label Module Provider in `lwr.config.json`.

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

When registering the module provider, you can optionally configure the package specifier that is used when importing the labels and specify the location of the label files.

-   `provideDefault`: When true, if a label is not found, the provider returns the label reference as the value. When false, the provider returns undefined, allowing the subsequent module providers to attempt to resolve it.
-   `labelDirs`: An array of one or more label package specifiers and their locations on the file system.

```json
// lwr.config.json
{
    "moduleProviders": [
        [
            "@lwrjs/label-module-provider",
            {
                "provideDefault": true,
                "labelDirs": [
                    {
                        "dir": "$rootDir/src/labels",
                        "package": "@my/label"
                    }
                ]
            }
        ],
        "@lwrjs/app-service/moduleProvider",
        "@lwrjs/lwc-ssr/moduleProvider",
        "@lwrjs/lwc-module-provider",
        "@lwrjs/npm-module-provider"
    ]
}
```

If you don't specify configuration when registering Label Module Provider, it uses default configuration.

```json
{
    "provideDefault": false,
    "labelDirs": [
        {
            "dir": "$rootDir/src/labels",
            "package": "@salesforce/label"
        }
    ]
}
```

### Importing Labels into Your Component

Once the label files are in place and the Label Module Provider is configured, you can import a label into your component.
In this example, `import GREETING from '@my/label/home.greeting'` determines the language of the text that is displayed on the home page of the application.

-   `@my/label` is the package specifier configured through the Label Module Provider.
-   `home.greeting` is the label reference in the label files, in the format `namespace.name`.

```html
<!-- app.html -->
<template>
    <h1>{greeting}</h1>
</template>
```

```ts
// app.ts
import { LightningElement } from 'lwc';
import GREETING from '@my/label/home.greeting';

export default class LocalizedApp extends LightningElement {
    greeting = GREETING;
}
```

The Label Module Provider returns the label value from the file corresponding to the requested locale.

## Recipe Setup

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/labels
yarn start # prod mode and ESM format
```

Open the site at [http://localhost:3000](http://localhost:3000)

Try changing the browser language to English, Spanish, French or Italian. Refresh the page and see the text change.

See documentation for all commands [here](https://github.com/salesforce/lwr-recipes/blob/main/doc/get_started.md).

## Heroku Deployment

```bash
# from the lwr-recipes root
./scripts/heroku-deploy.sh
```

The application would be deployed at [https://lwr-labels.herokuapp.com/](https://lwr-labels.herokuapp.com/)
