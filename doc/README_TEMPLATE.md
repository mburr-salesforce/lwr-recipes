# Feature name

_See /module-provider/README.md for an example of a complete readme file._

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Topic 1](#topic-1)
    -   [Topic 2](#topic-2)
    -   ...
    -   [Topic n](#topic-n)
    -   [Configuration](#configuration)
-   [Recipe](#Recipe)
    -   [Setup](#setup)
    -   [Crucial files](#crucial-files)

## Introduction

_Short summary of the feature. What can a developer accomplish with this recipe? Can it stand alone? Or is it intended to be used with other recipes?_

## Details

_Add sub-headings to explain each concept of the feature. Use the sample sections below as guidance. One section should cover configuration of `lwr.config.json`._

### Topic 1

_Lorem ipsum dolor sit amet._

```
src/
  ├── assets/
  │   └── styles.css
  ├── modules/
  │   └── namespace/
  │       └── name/
  │           ├── name.css
  │           ├── name.html
  │           └── name.js
  └── index.ts
```

### Topic 2

_Nulla ut eros suscipit, vestibulum._

1. provide
1. step
1. by
1. step
1. instructions

### Topic n

_Interdum et malesuada fames ac._

```ts
// use plenty of code snippets
```

### Configuration

_Need details about what each of the sections of the config file are doing._

```json
//lwr.config.json
```

## Recipe

### Setup

_Describe any setup steps specific to this recipe._

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/recipe-dir # REPLACE WITH CORRECT DIRECTORY NAME
yarn start # dev mode and ESM format
```

Open the site at [http://localhost:3000](http://localhost:3000)

See documentation for all commands [here](https://github.com/salesforce/lwr-recipes/blob/master/README.md#getting-started).

### Crucial files

_Review list of links and add/remove as needed. Some of these represent critical setup steps and should be expanded into topic sections above._

-   server creation: [src/index.ts](./src/index.ts)
-   application configuration: [lwr.config.json](./lwr.config.json)
-   lwc module directory: [src/modules/](./src/modules)
-   static resources: [src/assets/](./src/assets)
-   content templates: [src/content/](./src/content)
-   layout templates: [src/layouts/](./src/layouts)
-   custom _module/view_ provider: [src/services/feature-provider.ts](./src/services/feature-provider.ts)
