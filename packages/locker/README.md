# Securing an application with Lightning Locker

## Features

-   Enables Lightning Locker to run modules in a secure sandbox. Locker is only enabled when running in AMD `yarn start:amd`

### Concepts

-   Use [Lightning Locker] (https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/security_code.htm) in an LWR application.

### Files

-   lwc modules at [src/modules/](./src/modules)
-   LWR configuration at [lwr.config.json](./lwr.config.json) (**Note**: `locker` enables locker and configures trusted components)
