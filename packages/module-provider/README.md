# Custom Module Provider

## Features

### Concepts

-   Creation of custom [Module Providers](https://rfcs.lwc.dev/rfcs/lws/0000-registry-v2#module-providers).

### Files

-   lwc modules at [src/modules/](./src/modules)
-   LWR configuration at [lwr.config.json](./lwr.config.json)
-   server creation in TypeScript at [src/index.ts](./src/index.ts)
-   custom LWC Module Provider at [src/services/color-provider.ts](./src/services/color-provider.ts)
    -   **Note**: extends from `@lwrjs/lwc-module-provider` to handle LWC compilation
-   custom ES Module Provider at [src/services/echo-provider.ts](./src/services/echo-provider.ts)
