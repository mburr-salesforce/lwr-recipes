# Nested Routing Example

-   [Nested Routing Example](#nested-routing-example)
    -   [Introduction](#introduction)
    -   [Details](#details)
        -   [Project Setup](#project-setup)
        -   [Navigation Setup](#navigation-setup)
        -   [Create a Parent Router](#create-a-parent-router)
        -   [Create a Child Router](#create-a-child-router)
        -   [Configuration](#configuration)
    -   [Recipe Setup](#recipe-setup)
    -   [Heroku Deployment](#heroku-deployment)

## Introduction

The [`@lwrjs/router` package](https://github.com/salesforce/lwr/tree/master/packages/%40lwrjs/router) provides client-side routing modules, which are used to create a Static Page Application (SPA). LWR routers can be nested, to create a hierarchy in an application.

## Details

Additional resources:

-   See the simple routing recipe [here](https://github.com/salesforce/lwr-recipes/tree/master/packages/simple-routing).
-   Learn more in the [LWR Routing & Navigation doc](https://github.com/salesforce/lwr-recipes/blob/master/doc/navigation.md).
-   Read the RFC sections on nested routing [here](https://rfcs.lwc.dev/rfcs/lwr/0003-router-api-baseline#nested-mount-point).

### Project Setup

```
nested-routing
├── src
│   ├── index.ts // start the LWR server
│   ├── assets   // static images
│   └── modules
│       └── example
│           ├── app                // SPA root and parent router owner
│           │   ├── app.css
│           │   ├── app.html
│           │   ├── app.ts
│           │   └── navItems.ts
│           ├── animal             // owns the child router
│           │   ├── animal.html
│           │   ├── animal.ts
│           │   └── defaultAnimals.ts
│           ├── *PageHandler       // various RouteHandler modules
│           ├── *                  // other various components
│           ├── childRouter
│           │   └── childRouter.ts // defines the child router
│           └── rootRouter
│               └── rootRouter.ts  // defines the parent router
└── lwr.config.json                // LWR app configuration
```

### Navigation Setup

This recipe is a SPA with 2 levels of client-side routing. The root component (i.e. `example/app`) owns the parent router, and the `example/animal` component owns the child router. The sitemap for the app looks like this:

| Owner                                    | view component       | URL         |
| ---------------------------------------- | -------------------- | ----------- |
| [parent router](#create-a-parent-router) | `example/home`       | /           |
| ""                                       | `example/animal`     | /animal     |
| [child router](#create-a-child-router)   | `example/animalHome` | /animal/    |
| ""                                       | `example/animalCat`  | /animal/cat |
| ""                                       | `example/animalDog`  | /animal/dog |

The child router lives under the `/animal` parent URL, so all of its absolute URLs are prefixed with `/animal`. The parent router owns the beginning URL segments (`/` and `/animal`) while the child router owns the ending URL segments (`/`, `/cat` and `/dog`).

When a user navigates to any of the `/animal/*` URLs, they will see 2 view components on the page:

1. `example/animal` from the parent router
2. `example/animalHome`, `example/animalCat` or `example/animalDog` from the child router

### Create a Parent Router

The parent route definitions are defined in [`example/rootRouter`](https://github.com/salesforce/lwr-recipes/blob/master/packages/nested-routing/src/modules/example/rootRouter/rootRouter.ts) and output in [`example/app`](https://github.com/salesforce/lwr-recipes/blob/master/packages/nested-routing/src/modules/example/app/app.html).

```ts
// parent route definitions in "example/rootRouter"
const routes: RouteDefinition[] = [
    {
        id: 'home',
        uri: '/',
        handler: (): Promise<RouteHandlerModule> => import('example/homePageHandler'), // "example/home"
        page: { type: 'home' },
    },
    {
        id: 'animal',
        uri: '/animal',
        handler: (): Promise<RouteHandlerModule> => import('example/animalPageHandler'), // "example/animal"
        page: { type: 'animal' },
        exact: false, // indicates that "example/animal" contains a child router
    },
];
```

> _Important_: Since the child router is attached to the `/animal` URI, `RouteDefinition` MUST have `exact: false`.

```html
<!-- parent outlet in "example/app" -->
<template>
    <!-- parent router -->
    <lwr-router-container router="{router}">
        <example-nav items="{navItems}"></example-nav>
        <!-- outputs parent router view components -->
        <lwr-outlet></lwr-outlet>
    </lwr-router-container>
</template>
```

### Create a Child Router

The child route definitions are defined in [`example/childRouter`](https://github.com/salesforce/lwr-recipes/blob/master/packages/nested-routing/src/modules/example/childRouter/childRouter.ts) and output in [`example/animal`](https://github.com/salesforce/lwr-recipes/blob/master/packages/nested-routing/src/modules/example/animal/animal.html).

```ts
// parent route definitions in example/childRouter
const routes: RouteDefinition[] = [
    {
        id: 'home',
        uri: '/',
        handler: (): Promise<RouteHandlerModule> => import('example/animalHomePageHandler'), // "example/animalHome"
        page: { type: 'animalHome' },
    },
    {
        id: 'animal',
        uri: '/:pageName',
        // "example/animalCat" or "example/animalDog"
        handler: (): Promise<RouteHandlerModule> => import('example/animalNamedPageHandler'),
        page: {
            type: 'namedAnimalPage',
            attributes: { pageName: ':pageName' },
        },
    },
];
```

```html
<!-- child outlet in example/animal -->
<template>
    <!-- child router -->
    <lwr-router-container router="{childRouter}">
        <h1>{title}</h1>
        <!-- outputs child router view components -->
        <lwr-outlet></lwr-outlet>
        <ul>
            <!-- Dog | Cat navigation links -->
            <template for:each="{animals}" for:item="animal">
                <li key="{animal.title}">
                    <!-- // outputs the "/animal/dog" and "/animal/cat" links -->
                    <example-link
                        page-reference="{animal.pageReference}"
                        label="{animal.title}"
                    ></example-link>
                </li>
            </template>
        </ul>
    </lwr-router-container>
</template>
```

### Configuration

Please note `routes` defined in `lwr.config.json` are **server-side**; they are different from the `RouteDefinition[]` array defined for client-side routers.

```json
// nested-routing/lwr.config.json
{
    "lwc": { "modules": [{ "dir": "$rootDir/src/modules" }] },
    "routes": [
        {
            "id": "app",
            "path": "/",
            "rootComponent": "example/app"
        },
        {
            "id": "animal",
            "path": "/animal",
            "rootComponent": "example/app"
        }
    ]
}
```

## Recipe Setup

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/nested-routing
yarn start # prod mode and ESM format
```

Open the site at [http://localhost:3000](http://localhost:3000)

See documentation for all commands [here](https://github.com/salesforce/lwr-recipes/blob/master/doc/get_started.md).

## Heroku Deployment

```bash
# from the lwr-recipes root
./scripts/heroku-deploy.sh
```

The application would be deployed at [https://lwr-nested-routing.herokuapp.com/](https://lwr-nested-routing.herokuapp.com/)
