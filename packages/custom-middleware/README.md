# Server Types

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Project Setup](#project-setup)
    -   [Middleware Configuration](#middleware-configuration)
-   [Recipe Setup](#recipe-setup)

## Introduction

In this recipe we will show you how to configure your serverType and add custom middleware to LWR.

## Details

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

We have added our own middleware in index.ts. In the app.js we are doing a client side request back to the app server to capture and display the HTTP headers coming from the server.

### Middleware Configuration

```js
// Use express middleware directly
expressApp.use(async (req: Request, res: Response, next) => {
    res.setHeader('express-custom-header', 'Express middleware is running!');
    next();
});
```

## Recipe Setup

Use the following command to build this recipe.

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/custom-middleware
yarn start:express
```

Open the site at [http://localhost:3000](http://localhost:3000)

See documentation for all commands [here](https://github.com/salesforce/lwr-recipes/blob/master/doc/get_started.md).
