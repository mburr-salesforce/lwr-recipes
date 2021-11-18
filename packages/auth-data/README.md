# Authentication and Data

-   [Authentication and Data](#authentication-and-Data)
    -   [Introduction](#introduction)
    -   [Details](#details)
        -   [Project Setup](#project-setup)
        -   [Connected App](#connected-app)
        -   [Authentication](#authentication)
        -   [Data Access](#data-access)
        -   [Configuration](#configuration)
    -   [Recipe Setup](#recipe-setup)

## Introduction

This recipe shows how to login to Salesforce using the [OAuth 2.0 Web Server Flow](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_web_server_flow.htm&type=5). Once authenticated, [UI API wire adapters and functions](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_ui_api) can be used throughout the LWR application to access Salesforce data.

## Details

### Project Setup

There are a few files to note in the project directories:

-   _src/assets/_ contains static files from [Chart.js](https://www.chartjs.org/) and [SLDS](https://www.lightningdesignsystem.com/) (see also: [base components](https://github.com/salesforce/lwr-recipes/tree/master/packages/base-slds) recipe)
-   _src/layouts/main.html_ pulls the static files into the app
-   _src/modules_ contains:
    -   the `example/data` [root component](#configuration)
    -   other `example/data\*` components which display charts and tables
    -   the `example/setupLDS` module which sets up [Luvio](https://rfcs.lwc.dev/rfcs/luvio) to enable [Salesforce data access](#data-access)
-   _src/server/authMiddleware_ logs into Salesforce and retrieves authentication tokens

```text
src/
  ├── assets/
  ├── layouts/
  │   └── main.html
  ├── modules/
  │   └── example/
  │       ├── data*/
  │       │   ├── data*.css
  │       │   ├── data*.html
  │       │   └── data*.ts
  │       └── setupLDS/
  │           ├── network.ts
  │           └── setupLDS.ts
  ├── server/
  │   └── authMiddleware.ts
  └── index.ts
```

### Connected App

To enable authenticated access to Salesforce data, first set up a [Connected App](https://help.salesforce.com/articleView?id=sf.connected_app_overview.htm&type=5):

1. Create a Connected App with OAuth Settings using these [instructions](https://help.salesforce.com/articleView?id=sf.connected_app_create_api_integration.htm&type=5) and:
    1. Set the "Callback URL" to `http://localhost:3000/oauth` (used by the [authentication middleware](https://github.com/salesforce/lwr-recipes/tree/master/packages/auth-data/src/server/authMiddleware.ts))
    1. Make a note of the "Consumer Key" and "Consumer Secret" (or find them later in the App Manager)
    1. Go to Setup -> "Manage Connected Apps", click "Edit" for the app, set "Permitted Users" to "All users may self-authorize", and "Save"
1. Enable CORS:
    1. In Setup go to "CORS"
    1. Add a new "Allowed Origin" set to the URL for this recipe (i.e. `http://localhost:3000`)

### Authentication

This recipe uses the [OAuth 2.0 Web Server Flow](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_web_server_flow.htm&type=5) to authenticate to a Connected App via the following steps:

1. If the current user is not logged in, the [data chart component](https://github.com/salesforce/lwr-recipes/tree/master/packages/auth-data/src/modules/example/dataChart) displays a link to `/login`.
1. The `/login` endpoint in the [authentication middleware](https://github.com/salesforce/lwr-recipes/tree/master/packages/auth-data/src/server/authMiddleware.ts) retrieves an OAuth token from the Connected App and stores it in a cookie.
1. The LWR app reloads and the [Luvio network adapter](https://github.com/salesforce/lwr-recipes/tree/master/packages/auth-data/src/modules/example/setupLDS/network.ts) uses the cookie to add `Authorization` headers to [Salesforce data requests](#data-access).

> Identity information for the Connected App is safely stored on the [server](https://github.com/salesforce/lwr-recipes/tree/master/packages/auth-data/src/index.ts); keys and secrets are **never** exposed on the client.

### Data Access

Once OAuth is set up, and the current user is logged in, Salesforce data can be accessed and updated via the [Lightning Data Service (LDS)](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.data_ui_api) and associated [`lightning/ui*Api` wire adapters and functions](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_ui_api). The LDS and adapter code lives in the `@salesforce/lwc-adapters-uiapi` and `lwc-components-lightning` packages.

The LDS adapters and functions are enabled by setting up a default [Luvio](https://rfcs.lwc.dev/rfcs/luvio) instance in a [bootstrap `service`](https://rfcs.lwc.dev/rfcs/lwr/0000-lwr-app-config#client-bootstrap-config). The Luvio instance uses a custom [network adapter](https://github.com/salesforce/lwr-recipes/tree/master/packages/auth-data/src/modules/example/setupLDS/network.ts) which makes [authenticated](#authentication) requests to the [UI API](https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_get_started.htm) on behalf of LDS.

It is important to avoid timing issues with LDS initialization. The default Luvio instance **must** be established before any component which uses the adapters is defined. Initializing Luvio/LDS in a bootstrap `service` of the [Application Bootstrap Module](https://rfcs.lwc.dev/rfcs/lwr/0000-lwr-bootstrap#application-bootstrap-module) ensures that code executes in the correct order.

### Configuration

The LWR configuration contains some important settings:

-   the `@salesforce/lwc-adapters-uiapi` and `lwc-components-lightning` packages supply modules containing the UI API wire adapters and functions
-   bundling **must** exclude the `@salesforce/lds-default-luvio` module, as it is a singleton
-   the `force/ldsAdaptersUiapi` (exposed in the `@salesforce/lwc-adapters-uiapi` package) and `example/dataChart` modules **must** be trusted by [Locker](https://rfcs.lwc.dev/rfcs/locker) so they can access the global scope; `example/setupLDS` is trusted so it can access the [authentication cookie](#authentication)
-   the `example/setupLDS` module **must** be configured as a bootstrap `service`

```json
// abridged lwr.config.json
{
    "lwc": {
        "modules": [
            { "dir": "$rootDir/src/modules" },
            { "npm": "@salesforce/lwc-adapters-uiapi" },
            { "npm": "lwc-components-lightning" }
        ]
    },
    "bundleConfig": { "exclude": ["lwc", "@lwc/synthetic-shadow", "@salesforce/lds-default-luvio"] },
    "locker": {
        "enabled": true,
        "trustedComponents": [
            "@lwc/synthetic-shadow",
            "force/ldsAdaptersUiapi",
            "example/dataChart",
            "example/setupLDS"
        ]
    },
    "routes": [
        {
            "id": "auth-data",
            "path": "/",
            "rootComponent": "example/data",
            "bootstrap": {
                "services": ["example/setupLDS"]
            }
        }
    ]
}
```

## Recipe Setup

**Important**: Before running the recipe, ensure the [Connected App](#connected-app) domain, consumer key, consumer secret, and redirect URI are set in [_src/index.ts_](https://github.com/salesforce/lwr-recipes/tree/master/packages/auth-data/src/index.ts).

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/auth-data
yarn start # dev mode and ESM format
```

Open the site at [http://localhost:3000](http://localhost:3000)

See documentation for all commands [here](https://github.com/salesforce/lwr-recipes/blob/master/doc/get_started.md).
