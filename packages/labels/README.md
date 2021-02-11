# Localizing an Application with Labels

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Adding Label Files](#adding-label-files)
    -   [Configuration](#configuration)
    -   [Importing Labels into Your Component](#importing-labels-into-your-component)
-   [Recipe Setup](#Recipe-setup)

## Introduction

When building a web application, it is likely that localization will be an important part of that process. Part of localization is translating text into various languages. That can be achieved in your LWR app by leveraging the Label Module Provider. This provider will serve file-based labels in your app as ES modules based on the locale, allowing you to import translatable text into your components and avoid hardcoding. The locale is determined with the following precedence:

1. `locale` path parameter in the request
2. `Accept-Language` header in the request
3. The default locale set by the runtime

## Details

A simple example is importing greeting text via `import greeting from '@my/label/home.greeting'` that will be displayed on the home page of the application.

`@my/label`: the package specifier configured through the Label Module Provider

`home.greeting`: the label reference in the label files, in the format `namespace.name`

### Project Setup

Labels must be added as json files, with a file per supported locale. The filenames are expected to be the locale code to which those labels correspond. All the locale files for a set of labels must be in the same directory. For example,

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

_Note_: 2-letter locale files are always used as fallback if the label file for a specific country cannot be found. For example, if the label file for `en-US` cannot be found, it will fallback to `en`.

The file contents are a JSON object containing the label references and values nested by namespace. For example, the label `@my/label/home.greeting` would be added to the file as

```json
{
    "home": {
        "greeting": "Hello"
    }
}
```

### Configuration

Label Module Provider is not a default provider so it must be added as a dependency in _package.json_ and then registered and configured in _lwr.config.json_.

```json
// package.json
{
    "dependencies": {
        "@lwrjs/label-module-provider": "0.0.2-alpha51",
        "lwc": "1.11.4",
        "lwr": "0.0.2-alpha51"
    }
}
```

When registering the module provider, you can also optionally configure the package specifier that will be used when importing the labels and where on the file system the label files are located.

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
                        "dir": "<rootDir>/src/labels",
                        "package": "@my/label"
                    }
                ]
            }
        ],
        "@lwrjs/app-service/moduleProvider",
        "@lwrjs/lwc-module-provider",
        "@lwrjs/npm-module-provider"
    ]
}
```

_provideDefault:_ When true, if a label is not found, the provider returns the label reference as the value. When false, the provider returns undefined, allowing the subsequent module providers to attempt to resolve it.

_labelDirs_: An array of label package specifiers and their locations on the file system. Note that you can have multiple label specifiers and directories.

If no configuration is specified when registering Label Module Provider, i.e.

```json
// lwr.config.json
{
    "moduleProviders": [
        "@lwrjs/label-module-provider",
        "@lwrjs/app-service/moduleProvider",
        "@lwrjs/lwc-module-provider",
        "@lwrjs/npm-module-provider"
    ]
}
```

then the default configuration will be used:

```json
{
    "provideDefault": false,
    "labelDirs": [
        {
            "dir": "<rootDir>/src/labels",
            "package": "@salesforce/label"
        }
    ]
}
```

_Note_: The `moduleProviders` array overwrites the default one provided by LWR, so **all** module providers needed by the application must be listed, including those owned by LWR. The latest default module provider list is in the LWR source code [here](https://github.com/salesforce/lwr/blob/68c660a224d1a4f6e40a17d04aa2825be5cdd776/packages/%40lwrjs/core/src/env-config.ts#L47-L50).

### Importing Labels into Your Component

Once the label files are in place and the Label Module Provider is configured, you can import a label into your component.

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

The Label Module Provider will return the label value from the file corresponding to the request locale.

## Recipe Setup

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/labels
yarn start # dev mode and ESM format
```

Open the site at [http://localhost:3000](http://localhost:3000)

Try changing the browser language to English, Spanish, French or Italian. Refresh the page and see the text change.

See documentation for all commands [here](https://github.com/salesforce/lwr-recipes/blob/master/doc/getting_started.md).
