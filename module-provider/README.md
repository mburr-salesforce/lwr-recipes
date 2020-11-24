# Custom Module Provider

## Features

### Concepts

- Creation of a custom [Module Provider](https://rfcs.lwc.dev/rfcs/lws/0000-registry-v2#module-providers).

### Files

- lwc modules at [src/modules/](./src/modules)
- LWR configuration at [lwr.config.json](./lwr.config.json)
- server creation in TypeScript at [src/index.ts](./src/index.ts)
- custom Module Provider at [src/services/color-provider.ts](./src/services/color-provider.ts)

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
- Open the site at [http://localhost:3000](http://localhost:3000)
- See explanation in the browser

### Clean

```bash
# remove the build directory and file cache
npm run clean
```