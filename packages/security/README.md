# Security

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Project Setup](#project-setup)
    -   [Helmet Configuration](#helmet-configuration)
-   [Recipe Setup](#Recipe-setup)

## Introduction

In this recipe we will show you how to add and configure standard HTTP security headers to better secure your application.

## Details

For this we are using an open source library call [Helmet](https://helmetjs.github.io/). We will show how to integrate this with the underlying Express application.

### Project Setup

```
src/
  ├── modules/
  │   └── example/
  │       └── app/
  │           ├── app.css
  │           ├── app.html
  │           └── app.js
  └── index.ts
```

We have added the integration with Helmet in index.ts. In the app.js we are doing a client side request back to the app server to capture and display the HTTP headers coming from the server.

### Helmet Configuration

As you can see in index.ts we are setting up configuration with Helmet. In this case we are setting some specific values to return for our CSP. See [Helmet](https://helmetjs.github.io/) web site for additional configurations.

```js
//Use Helmet to enable several out of the box security headers
expressApp.use(
    Helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'", 'salesforce.com', "'unsafe-inline'"],
            },
        },
    }),
);
```

## Recipe Setup

Use the following command to build this recipe.

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/security
yarn start
```

Open the site at [http://localhost:3000](http://localhost:3000)

See documentation for all commands [here](https://github.com/salesforce/lwr-recipes/blob/master/doc/get_started.md).
