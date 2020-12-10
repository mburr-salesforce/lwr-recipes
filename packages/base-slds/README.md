# Using Salesforce Lightning Design System and Base Components

## Features

### Concepts

- Use the [Salesforce Lightning Design System (SLDS)](https://www.lightningdesignsystem.com/getting-started/) in an LWR application.
- Use the [`lightning-base-components`](https://github.com/salesforce/lightning-base-components) package.

### Files

- lwc modules at [src/modules/](./src/modules)
- LWR configuration at [lwr.config.json](./lwr.config.json) (**Note**: `syntheticShadow` is ON to allow global SLDS stylesheet)
- server creation in TypeScript at [src/index.ts](./src/index.ts)
- link to the SLDS stylesheets in a static layout template at [src/layouts/main.html](./src/layouts/main.html)
- pull `@salesforce-ux/design-system` into [package.json](./package.json)
- copy SLDS resources into the LWR project with [scripts/copy-resources.js](./scripts/copy-resources.js)

## Commands

### Install and Build

```bash
npm install
npm run build
```

### Run

```bash
# in prod mode and ESM format
npm start
```
Open the sample: [http://localhost:3000](http://localhost:3000)

### Clean

```bash
# remove the build directory and file cache
npm run clean
```