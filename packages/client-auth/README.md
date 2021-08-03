# Client Authentication and Data

-   [Client Authentication and Data](#client-authentication-and-Data)
    -   [Introduction](#introduction)
    -   [Details](#details)
        -   [Project Setup](#project-setup)
        -   [Authentication](#authentication)
        -   [Data Access](#data-access)
        -   [Configuration](#configuration)
    -   [Recipe Setup](#recipe-setup)

## Introduction

This recipe shows how to do client-side authentication using the [OAuth 2.0 User-Agent Flow](https://help.salesforce.com/articleView?id=sf.remoteaccess_oauth_user_agent_flow.htm&type=5). Once authenticated, [UI API wire adapters and functions](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_ui_api) can be used throughout the LWR application.

## Details

### Project Setup

There are a few sections to note in the project directories:

-   _src/assets/_ contains static files from [SLDS](https://www.lightningdesignsystem.com/) (as seen in the [base components](https://github.com/salesforce/lwr-recipes/tree/master/packages/base-slds) recipe) and [Chart.js](https://www.chartjs.org/)
-   _src/layouts/main.html_ pulls in the static files
-   _src/modules_ contains the "example/app" [root component](#configuration), a few "example/data\*" components which display the recipe UI, and "example/loginLink" which does the [client-side authentication](#authentication)
-   _src/modules/data/_ contains code which sets up [Luvio](https://rfcs.lwc.dev/rfcs/luvio) to allow [Salesforce data access](#data-access)

```text
src/
  ├── assets/
  ├── layouts/
  │   └── main.html
  ├── modules/
  │   ├── example/
  │   │   ├── app/
  │   │   │   ├── app.html
  │   │   │   └── app.ts
  │   │   ├── data*/
  │   │   │   ├── data*.css
  │   │   │   ├── data*.html
  │   │   │   └── data*.ts
  │   │   └── loginLink/
  │   │       ├── loginLink.css
  │   │       ├── loginLink.html
  │   │       └── loginLink.ts
  │   └── data/
  │       └── uiApi/
  │           ├── network.ts
  │           └── uiApi.ts
  └── index.ts
```

### Authentication

This recipe uses the [OAuth 2.0 User-Agent Flow](https://help.salesforce.com/articleView?id=sf.remoteaccess_oauth_user_agent_flow.htm&type=5) to authenticate to a [Connected App](https://help.salesforce.com/articleView?id=sf.connected_app_overview.htm&type=5).

The recipe's [login link component](https://github.com/salesforce/lwr-recipes/tree/master/packages/client-auth/src/modules/example/loginLink) handles the flow. The origin and "consumer key" for the Connected App are passed into the component through the ["example/dataChart" template](https://github.com/salesforce/lwr-recipes/tree/master/packages/client-auth/src/modules/example/dataChart/dataChart.html).

To set up a Connected App and enable OAuth, follow these steps:

1. Create a Connected App with OAuth Settings using these [instructions](https://help.salesforce.com/articleView?id=sf.connected_app_create_api_integration.htm&type=5) and:
    1. Set the "Callback URL" to the URL of this recipe (e.g. `"http://localhost:3000/"`)
    1. Make a note of the "Consumer Key"
    1. Under Setup -> Manage Connected Apps, click "Edit" for the app and set "Permitted Users" to "Admin approved users are pre-authorized" and "Save"
    1. Approve Profiles to be permitted to access the Connected App:
        1. Go to Setup -> Profiles
        1. Select the desired Profile and click "Assigned Connected Apps"
        1. Add the Connected App to the "Enabled Connected Apps" list and click "Save"
1. Enabled CORS:
    1. In Setup go to "CORS"
    1. Add a new "Allowed Origin" set to the origin of this recipe (e.g. `"http://localhost:3000"`)

> **Note**: This authentication flow requires that the "consumer key" to the Connected App is visible in the LWR application markup, and the token be set in `localStorage`. If this is not acceptable, consider using a different [OAuth flow](https://help.salesforce.com/articleView?id=sf.remoteaccess_oauth_flows.htm&type=5) which is server-side.

### Data Access

Once OAuth is setup, and the current user is logged in, Salesforce data can be accessed and updated via the [`lightning/ui*Api` wire adapters and functions](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_ui_api), the code for which lives in the "@salesforce/lwc-adapters-uiapi" and "lwc-components-lightning" packages.

These adapters and functions are enabled by setting up a default [Luvio](https://rfcs.lwc.dev/rfcs/luvio) instance in the LWR application root component, ["example/app"](https://github.com/salesforce/lwr-recipes/tree/master/packages/client-auth/src/modules/example/app/app.ts). The Luvio instance uses a custom [network adapter](https://github.com/salesforce/lwr-recipes/tree/master/packages/client-auth/src/modules/data/uiApi/network.ts) which integrates the authentication token procured by the [login link](#authentication).

It is important to avoid timing issues with this setup; the default Luvio instance **must** be established before the UI API adapters are used by the "example/data\*" components. Pulling the "example/data" component into the "example/app" via a [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports) ensures correct ordering of code execution.

### Configuration

The LWR configuration contains a few important parts:

-   the "@salesforce/lwc-adapters-uiapi" and "lwc-components-lightning" packages supply modules containing the [UI API wire adapters and functions](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_ui_api)
-   bundling **must** exclude the "@salesforce/lds-default-luvio" module, as it is a singleton
-   the "force/ldsAdaptersUiapi" (exposed in the "@salesforce/lwc-adapters-uiapi" package) and "example/dataChart" modules are trusted by [Locker](https://rfcs.lwc.dev/rfcs/locker) so they can access the global `process` variable

```json
// lwr.config.json
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
        "trustedComponents": ["@lwc/synthetic-shadow", "force/ldsAdaptersUiapi", "example/dataChart"]
    }
}
```

## Recipe Setup

Before running the recipe, ensure the [Connected App](#authentication) origin and consumer key are set in the ["example/dataChart" template](https://github.com/salesforce/lwr-recipes/tree/master/packages/client-auth/src/modules/example/dataChart/dataChart.html).

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/client-auth
yarn start # dev mode and ESM format
```

Open the site at [http://localhost:3000](http://localhost:3000)

See documentation for all commands [here](https://github.com/salesforce/lwr-recipes/blob/master/doc/get_started.md).
