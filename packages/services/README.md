# Using LWR Services

## Features

### Concepts

- Configure and use LWR services to allow for:
    - [LWR Loader Hooks](https://rfcs.lwc.dev/rfcs/lws/0000-lwr-loader-hooks)
        - **Note**: Loader Hooks are an [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)-only feature
    - [LWR Module Invalidation Hooks](https://rfcs.lwc.dev/rfcs/lws/0000-lwr-module-invalidation-hooks)

### Files

- lwc modules at [src/modules/](./src/modules)
- LWR configuration at [lwr.config.json](./lwr.config.json)
- server creation in TypeScript at [src/index.ts](./src/index.ts)
- custom loader hooks at [src/modules/example/loaderHooks/loaderHooks.js](./src/modules/example/loaderHooks/loaderHooks.js)
- custom module invalidation hook at [src/modules/example/invalidationHook/invalidationHook.js](./src/modules/example/invalidationHook/invalidationHook.js)