# Multiple Router Outlets Example

-   [Multiple Router Outlets Example](#multiple-router-outlets-example)
    -   [Introduction](#introduction)
    -   [Details](#details)
        -   [Project Setup](#project-setup)
        -   [Multiple Views](#multiple-views)
            -   [Using Multiple RouteHandlers](#using-multiple-routehandlers)
            -   [Using Variable Views](#using-variable-views)
        -   [Multiple Outlets](#multiple-outlets)
        -   [Configuration](#configuration)
    -   [Recipe Setup](#recipe-setup)

## Introduction

This example demonstrates how a `RouteHandler` can return multiple views within the `viewset`. These view componenets can then be displayed by using multiple outlets with different `view-names`.

## Details

Additional resources:

-   See the simple routing recipe [here](https://github.com/salesforce/lwr-recipes/tree/main/packages/simple-routing).
-   See the nested routing recipe [here](https://github.com/salesforce/lwr-recipes/tree/main/packages/nested-routing).
-   Learn more about using multiple outlets in the [LWR Routing & Navigation doc](https://github.com/salesforce/lwr-recipes/blob/main/doc/navigation.md#multiple-outlets).
-   Read the RFC sections on `viewsets` [here](https://rfcs.lwc.dev/rfcs/lwr/0002-route-handler#router-specifies-handler).

### Project Setup

```
multiple-outlets
├── src
│   ├── assets   // static images
│   └── modules
│       └── example
│           ├── app
│           │   ├── app.css
│           │   ├── app.html
│           │   ├── app.ts
│           │   └── navItems.ts
│           ├── animal             // animal view
│           │   ├── animal.css
│           │   ├── animal.html
│           │   └── animal.ts
│           ├── home             // home view
│           │   ├── home.css
│           │   ├── home.html
│           │   └── home.ts
│           ├── misc             // misc view
│           │   ├── misc.css
│           │   ├── misc.html
│           │   └── misc.ts
│           ├── *Footer             // corresponding footer views
│           ├── *Sidebar            // corresponding sidebar views
│           ├── *PageHandler        // various RouteHandler modules
│           └── *                   // other various components
├── lwr.config.json                // LWR app configuration
└── tsconfig.json
```

### Multiple Views

To create multiple views per route, return multiple views with different names in the `viewset` of the `RouteHandler`.

```ts
//"example/homePageHandler/homePageHandler.ts"
import type { Module, RouteHandlerCallback } from 'lwr/router';

export default class HomePageHandler {
    callback: RouteHandlerCallback;

    constructor(callback: RouteHandlerCallback) {
        this.callback = callback;
    }

    dispose(): void {
        /* noop */
    }

    update(): void {
        this.callback({
            viewset: {
                // return multiple views
                default: (): Promise<Module> => import('example/home'),
                footer: (): Promise<Module> => import('example/homeFooter'),
                sidebar: (): Promise<Module> => import('example/homeSidebar'),
            },
        });
    }
}
```

For different pages, use different a `RouteHandler` to set up the correct `viewset`, or use a variable.

#### Using Multiple RouteHandlers

```ts
const routes: RouteDefinition[] = [
    {
        id: 'home',
        uri: '/',
        handler: (): Promise<RouteHandlerModule> => import('example/homePageHandler'),
        page: {
            type: 'home',
        },
    },
    {
        id: 'animal',
        uri: '/animal',
        handler: (): Promise<RouteHandlerModule> => import('example/animalPageHandler'),
        page: {
            type: 'animal',
            attributes: {
                pageName: 'animal',
            },
        },
    },
    {
        id: 'misc',
        uri: '/misc',
        handler: (): Promise<RouteHandlerModule> => import('example/animalPageHandler'),
        page: {
            type: 'misc',
            attributes: {
                pageName: 'misc',
            },
        },
    },
];
```

The animalPageHandler then uses a variable.

#### Using Variable Views

```ts
//"example/animalPageHander/animalpageHandler.ts"
import type { RouteHandlerCallback, RouteInstance, Module } from 'lwr/router';

export default class AnimalPageHandler {
    callback: RouteHandlerCallback;

    constructor(callback: RouteHandlerCallback) {
        this.callback = callback;
    }

    dispose(): void {
        /* noop */
    }

    update(routeInstance: RouteInstance): void {
        const { attributes } = routeInstance;
        let defaultViewGetter, footerViewGetter, sidebarViewGetter;
        switch (attributes.pageName) {
            case 'animal':
                defaultViewGetter = (): Promise<Module> => import('example/animal');
                footerViewGetter = (): Promise<Module> => import('example/animalFooter');
                sidebarViewGetter = (): Promise<Module> => import('example/animalSidebar');
                break;
            case 'misc':
                defaultViewGetter = (): Promise<Module> => import('example/misc');
                footerViewGetter = (): Promise<Module> => import('example/miscFooter');
                sidebarViewGetter = (): Promise<Module> => import('example/miscSidebar');
                break;
            default:
                return;
        }

        this.callback({
            viewset: {
                default: defaultViewGetter,
                footer: footerViewGetter,
                sidebar: sidebarViewGetter,
            },
        });
    }
}
```

### Multiple Outlets

Use multiple outlets with the corresponding `view-names` within the `lwr-router-container` to display all the current view components.

```html
<!-- example/app/app.html -->
<template>
    <lwr-router-container router="{router}">
        <lwr-outlet view-name="sidebar"></lwr-outlet>
        <example-nav items="{navItems}"></example-nav>
        <lwr-outlet><!-- default view --> </lwr-outlet>
        <lwr-outlet view-name="footer"></lwr-outlet>
    </lwr-router-container>
</template>
```

### Configuration

A server-side route is added for each page in the app.

```json
// multiple-outlets/lwr.config.json
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
        },
        {
            "id": "misc",
            "path": "/misc",
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
cd packages/multiple-routing
yarn start # prod mode and ESM format
```

Open the site at [http://localhost:3000](http://localhost:3000)

See documentation for all commands [here](https://github.com/salesforce/lwr-recipes/blob/main/doc/get_started.md).
