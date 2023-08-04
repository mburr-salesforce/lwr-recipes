# Security

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Project Setup](#project-setup)
-   [Usage](#usage)
    -   [Security Wrapper](#security-wrapper)
    -   [Default Handler](#default-handler)
    -   [Headers](#headers)
-   [Recipe Setup](#Recipe-setup)
-   [Heroku Deployment](#heroku-deployment)

## Introduction

In this recipe we will show you how to add and configure standard HTTP security headers to better secure your application.

## Details

For this we are using the Security package from LWRJS to hash incoming scripts from LWR.

### Project Setup

```
src/
  ├── modules/
  │   └── example/
  │       └── app/
  │           ├── app.css
  │           ├── app.html
  │           └── app.js
  └── routeHandlers/
      └── routeHandler.ts
  └── index.ts
  └── test/
      └── security.spec.ts
  └── types
      └── wdio.d.ts
lwr.config.json
package.json
ts.config.json
```

## Usage

### Security Wrapper

Content-security-policies are set within the [_routeHandler.ts_](./src/routeHandlers/routeHandler.ts) file. Inline scripts from LWR are hashed automatically by the `secure()` wrapper from [@lwrjs/security](https://github.com/salesforce-experience-platform-emu/lwr/tree/main/packages/%40lwrjs/security). To set custom CSP headers, set headers within the `headers` object in [_routeHandler.ts_](./src/routeHandlers/routeHandler.ts) and they will be merged automatically with the default headers.

### Default Handler

The package can also be used with a default handler provided by [@lwrjs/security](https://github.com/salesforce-experience-platform-emu/lwr/tree/main/packages/%40lwrjs/security) by setting "@lwrjs/security" as the route handler. You can also optionally choose what headers are included in the handler by passing in an object with header tags. In [_lwr.config.json_](./lwr.config.json), you can see the default handler with header(s) disabled under routes csp-disabled and multiple-options.

### Headers

The default handler and security wrapper provide the following headers. With the default handler, you can pass in arguments to disable or enable specific headers like in the csp-disabled route within [_lwr.config.json_](./lwr.config.json).

```js
contentSecurityPolicy?: ContentSecurityPolicy | boolean;
referrerPolicy?: ReferrerPolicy | boolean;
strictTransportSecurity?: StrictTransportSecurity | boolean;
crossOriginEmbedderPolicy?: string | boolean;
crossOriginOpenerPolicy?: string | boolean;
crossOriginResourcePolicy?: string | boolean;
xContentTypeOptions?: boolean;
xFrameOptions?: boolean;
xPermittedCrossDomainPolicies?: boolean;
xXSSProtection?: boolean;
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

See documentation for all commands [here](https://github.com/salesforce-experience-platform-emu/lwr-recipes/blob/main/doc/get_started.md).

## Heroku Deployment

```bash
# from the lwr-recipes root
./scripts/heroku-deploy.sh
```

The application would be deployed at [https://lwr-security.herokuapp.com/](https://lwr-security.herokuapp.com/)
