# Server Types

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Project Setup](#project-setup)
    -   [Middleware Configuration](#middleware-configuration)
-   [Recipe Setup](#recipe-setup)
-   [Heroku Deployment](#heroku-deployment)

## Introduction

LWR gives you the flexibility to add custom middleware to your application. LWR can be configured to use different web frameworks like [ExpressJS](https://expressjs.com/en/guide/using-middleware.html) or [KoaJS](https://koajs.com/#application), via the _serverType_ property. For each of these supported frameworks, you can add middleware directly using that framework's middleware API. This recipe shows you how to configure LWR with each serverType, how to get access to the underlying Express or Koa server, and how to add your middleware.

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
  └── express.ts // Using custom middleware for ExpressJS
  └── koa.ts // Using custom middleware for KoaJS
```

### Middleware Configuration

In express.ts, create and start the Express server.

Set a custom server type for your LWR app server to `express`.

```js
const lwrServer = createServer({ serverType: 'express' });
```

Add the Express middleware directly.

```js
expressApp.use(async (req, res, next) => {
    res.setHeader('express-custom-header', 'Express middleware is running!');
    next();
});
```

In app.js, add a client side request back to the app server to capture and display the HTTP headers coming from the server.

## Recipe Setup

Use the following commands to build this recipe and start the LWR server.

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/custom-middleware
yarn start:express
```

Open the site at [http://localhost:3000](http://localhost:3000)

See documentation for all commands [here](https://github.com/salesforce/lwr-recipes/blob/main/doc/get_started.md).

## Heroku Deployment

```bash
# from the lwr-recipes root
./scripts/heroku-deploy.sh
```

The application would be deployed at [https://lwr-custom-middleware.herokuapp.com/](https://lwr-custom-middleware.herokuapp.com/)
