# Feature name

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Topic 1](#topic-1)
    -   [Topic 2](#topic-2)
    -   ...
    -   [Topic n](#topic-n)
-   [Recipe](#Recipe)
    -   [Setup](#setup)
    -   [Crucial files](#crucial-files)

## Introduction

*Summary of the feature.*

## Details

*Add sub-headings below to explain each concept of the feature. Be sure to include examples and code snippets whenever possible.*

*For most features, this section will include step by step instructions on how to set up the feature.*

### Topic 1

*Lorem ipsum dolor sit amet.*

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

*Nulla ut eros suscipit, vestibulum.*

1. provide
1. step
1. by
1. step
1. instructions

### Topic n

*Interdum et malesuada fames ac.*

```ts
// use plenty of code snippets
```

## Recipe

### Setup

*Describe any setup steps specific to this recipe.*

```bash
# from the lwr-recipes root
yarn install
yarn build
cd recipe-dir # REPLACE WITH CORRECT DIRECTORY NAME
yarn start # prod mode and ESM format
```

Open the site at [http://localhost:3000](http://localhost:3000)

**Note**: Use `yarn start:amd` to run in compatibility mode and AMD format.

See documentation for all commands [here](https://github.com/salesforce/lwr-recipes/blob/master/doc/CONTRIBUTING.md#startup).

### Crucial files

-   server creation: [src/index.ts](./src/index.ts)
-   application configuration: [lwr.config.json](./lwr.config.json)
-   lwc module directory: [src/modules/](./src/modules)
-   static resources: [src/assets/](./src/assets)
-   content templates: [src/content/](./src/content)
-   layout templates: [src/layouts/](./src/layouts)
-   custom *module/view* provider: [src/services/feature-provider.ts](./src/services/feature-provider.ts)
-   *remove irrelevant links above, and add any additional ones below*

