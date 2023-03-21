# SSR Base Document on Commerce Cloud Managed Runtime

The [Commerce Cloud Managed Runtime](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/mrt-overview.html) is a runtime platform for hosting highly scalable web applications.

This recipe shows how you can use LWR to create optimized applications using [LWC SSR](https://github.com/salesforce-experience-platform-emu/lwr/blob/main/packages/@lwrjs/lwc-ssr/README).md#overview) and [LWR Static Site Generation](https://github.com/salesforce-experience-platform-emu/lwr-recipes/tree/main/packages/static-generation).

In this app we use static site generation to pre-build all the module bundles along with an `ssr.js` which is a rolled up executable for parts of LWR needed at runtime. At runtime we have a lambda to handle URL requests. Base document requests will be fulfilled at runtime to generate the HTML document with the LWC content SSRed. The pre-build module bundles, assets and resources will be served statically.

## Project Setup

The directory structure looks like this:

```
src/
  ├── assets/           // static assets
  |   └── favicon.ico
  │   └── recipes-logo.png
  └── modules/          // lwc modules
      └── example/
          └── app/
              ├── app.css
              ├── app.html
              └── app.ts
lwr.config.json         // lwr configuration
package.json            // npm packaging configuration
```

## Configuration

The LWR server is configured in `lwr.config.json`, at the root of the project. This example has one LWC module and a server side rendered route.

```json
// lwr.config.json
{
    "serverMode": "prod-compat",
    "lwc": { "modules": [{ "dir": "$rootDir/src/modules" }] },
    "routes": [
        {
            "id": "example",
            "path": "/",
            "rootComponent": "example/app",
            "cache": { "ttl": 60 },
            "bootstrap": {
                "ssr": true
            }
        }
    ],
    "assets": [
        {
            "alias": "assetsDir",
            "dir": "$rootDir/src/assets",
            "urlPath": "/public/assets"
        },
        {
            "alias": "favicon",
            "file": "$rootDir/src/assets/favicon.ico",
            "urlPath": "/favicon.ico"
        }
    ],
    "staticSiteGenerator": {
        "skipBaseDocumentGeneration": true
    }
}
```

## Running the Project for local development

```bash
yarn install
yarn dev # ESM development mode
```

or

```bash
yarn dev:compat # To run in AMD format
```

Open the site at [http://localhost:3000](http://localhost:3000)

## Build and Preview the project

```bash
yarn build
yarn preview # Run a local preview of the site for MRT
```

## Publish to MRT

After provisioning a Commerce Cloud Managed Runtime Application (with the name from the `package.json`: `lwr-project`), you will need to setup your MRT API key and userid on your local computer (this only needs to be done once).

[Find out more about how to find your MRT API Key here.](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/using-the-managed-runtime-api.html?q=API-Key)

```bash
yarn mrt:save-creds -k $MRT_API_KEY -u $MRT_USER_ID # This only needs to be done once.
```

Then push your app to MRT with...

```bash
yarn mrt:push
```

To monitor logs for your published application in MRT use...

```bash
yarn mrt:tail
```
