# Using LWR Services

## Features

### Concepts

- Use the [LWR Loader Hooks](https://rfcs.lwc.dev/rfcs/lws/0000-lwr-loader-hooks).
    - **Note**: Loader Hooks are an [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)-only feature.
- Use the [LWR Module Invalidation Hooks](https://rfcs.lwc.dev/rfcs/lws/0000-lwr-module-invalidation-hooks).

### Files

- lwc modules at [src/modules/](./src/modules)
- LWR configuration at [lwr.config.json](./lwr.config.json)
- server creation in TypeScript at [src/index.ts](./src/index.ts)
- custom loader hooks at [src/modules/example/loaderHooks/loaderHooks.js](./src/modules/example/loaderHooks/loaderHooks.js)
- custom module invalidation hook at [src/modules/example/invalidationHook/invalidationHook.js](./src/modules/example/invalidationHook/invalidationHook.js)

## Commands

### Install and Build

```bash
npm install
npm run build
```

### Run

```bash
npm start
```
- Open the site at [http://localhost:3000](http://localhost:3000)
- Follow the instructions to demo the services

### Clean

```bash
npm run clean
```