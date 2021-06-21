# Feature Name

_See /module-provider/README.md for an example of a complete readme file._

-   [Feature Name](#feature-name)
    -   [Introduction](#introduction)
    -   [Details](#details)
        -   [Project Setup](#project-setup)
        -   [Topic 2](#topic-2)
        -   [Topic n](#topic-n)
        -   [Configuration](#configuration)
    -   [Recipe Setup](#recipe-setup)

## Introduction

_Short summary of the feature. What can a developer accomplish with this recipe? Can it stand alone? Or is it intended to be used with other recipes?_

## Details

_Add sub-headings to explain each concept of the feature. Use the sample sections below as guidance. One section should cover configuration of `lwr.config.json`._

### Project Setup

_Show file structure of project and call out any special files or structure that deviates from standard._

```text
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

_Example topic could include details about the @lwrjs APIs that this recipe uses._

```ts
// use plenty of code snippets
```

### Configuration

_Need details about what each of the sections of the config file are doing. Add link to Configure a LWR Project at ../doc/config.md._

```json
// lwr.config.json
```

## Recipe Setup

_Describe any setup steps specific to this recipe._

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/recipe-dir # REPLACE WITH CORRECT DIRECTORY NAME
yarn start # dev mode and ESM format
```

Open the site at [http://localhost:3000](http://localhost:3000)

See documentation for all commands [here](https://github.com/salesforce/lwr-recipes/blob/master/doc/get_started.md).
