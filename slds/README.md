# Using Salesforce Lightning Design System

## Features

### Concepts

- Use the [Salesforce Lightning Design System (SLDS)](https://www.lightningdesignsystem.com/getting-started/) in an LWR application.
- Create Static Site routes to display SLDS-styled content.

### Files

- LWR configuration at [lwr.config.json](./lwr.config.json)
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
npm run start:prod
```
Open the sample, which has links to the static pages: [http://localhost:3000](http://localhost:3000)

### Clean

```bash
npm run clean
```