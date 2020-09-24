# Using Base Components

## Features

**WARNING**: This sample is a work in progress; it does not yet resolve all base component internal references correctly.

### Concepts

- Use the [`lightning-base-components`](https://github.com/salesforce/lightning-base-components) package.

### Files

- lwc modules at [src/modules/](./src/modules)
- LWR configuration at [lwr.config.json](./lwr.config.json)
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
Open the site at [http://localhost:3000](http://localhost:3000)

### Clean

```bash
npm run clean
```