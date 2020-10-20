# Using Salesforce Lightning Design System and Base Components

## Features

### Concepts

- Use the [Salesforce Lightning Design System (SLDS)](https://www.lightningdesignsystem.com/getting-started/) in an LWR application.
- Use the [`lightning-base-components`](https://github.com/salesforce/lightning-base-components) package.
- Create Static Site routes to display SLDS-styled content.

### Files

- lwc modules at [src/modules/](./src/modules)
- LWR configuration at [lwr.config.json](./lwr.config.json)
- server creation in TypeScript at [src/index.ts](./src/index.ts)
- SLDS static content pages in [src/content/](./src/content)
- link to the SLDS stylesheets in a static layout template at [src/layouts/main.html](./src/layouts/main.html)
- pull `@salesforce-ux/design-system` into [package.json](./package.json)
- copy SLDS resources into the LWR project with [scripts/copy-resources.js](./scripts/copy-resources.js)
- server creation in TypeScript at [src/index.ts](./src/index.ts)

## Commands

### Install and Build

```bash
npm install
npm run build
```

### Run

```bash
# in dev mode
npm start
```
```bash
# in prod mode
# WARNING: This sample does not yet resolve all base component internal references correctly in PROD mode (AMD format).
npm run start:prod
```
Open the sample, which has links to the static pages: [http://localhost:3000](http://localhost:3000)

### Clean

```bash
npm run clean
```