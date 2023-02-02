# Simple Routing Example

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Project Setup](#project-setup)
    -   [Create a Router](#create-a-router)
    -   [Define a Route Handler](#define-a-route-handler)
    -   [Navigate](#navigate)
    -   [Error Handling](#error-handling)
    -   [Configuration](#configuration)
-   [Recipe Setup](#Recipe-setup)
-   [Heroku Deployment](#heroku-deployment)

## Introduction

Use the [`@lwrjs/router`](https://github.com/salesforce-experience-platform-emu/lwr/tree/main/packages/%40lwrjs/router) package to create a Single Page Application with client-side routing.

Important exports from the package:

-   `lwr/router`
-   `lwr/routerContainer`
-   `lwr/outlet`
-   `lwr/navigation`

## Details

> Learn more in the [LWR Routing & Navigation doc](https://github.com/salesforce-experience-platform-emu/lwr-recipes/blob/main/doc/navigation.md).

### Project Setup

```
simple-routing
├── src
│   ├── autostart.ts
│   ├── index.ts
│   ├── assets
│   │   └── wheat.jpg
│   └── modules
│       └── example
│           ├── app
│           │   ├── app.css
│           │   ├── app.html
│           │   ├── app.ts
│           │   └── navItems.ts
│           ├── contact
│           ├── home
│           ├── homePageHandler
│           ├── link
│           ├── namedPageHandler
│           ├── nav
│           ├── navItem
│           ├── price
│           ├── products
│           ├── recipes
│           ├── recipesItem
│           ├── recipesPageAttributeApplier
│           ├── recipesPageHandler
│           └── rootRouter
│               └── rootRouter.ts
├── lwr.config.json
├── package.json
├── tsconfig.json
└── utam.config.js
```

### Create a Router

Define route definitions in this type:

```ts
interface RouteDefinition<TMetadata = Record<string, any>> {
    id: string;
    uri: string;
    exact?: boolean;
    page?: Partial<PageReference>;
    handler: () => Promise<RouteHandlerModule>;
    metadata?: TMetadata;
}
```

The router should be created in the root component of your SPA.

Import the `createRouter` function from `lwr/router`, and pass the route definitions to `createRouter`. This function returns a router instance used by the `lwr/routerContainer`.

```ts
import { createRouter } from 'lwr/router';
import type { RouteDefinition, RouteHandlerModule, Router, PageReference } from 'lwr/router';

const routes: RouteDefinition[] = [
    {
        id: 'home',
        uri: '/',
        handler: (): Promise<RouteHandlerModule> => import('example/homePageHandler'),
        page: {
            type: 'home',
        },
    },
];

router = createRouter({ routes });
```

Attach this router instance to `lwr/routerContainer`.

```html
<template>
    <lwr-router-container router="{router}">
        <lwr-outlet onviewchange="{onViewChange}"></lwr-outlet>
    </lwr-router-container>
</template>
```

See the example [here](./src/modules/example/app/).

For more details, see [RFC: Router API](https://rfcs.lwc.dev/rfcs/lwr/0003-router-api-baseline).

### Define a Route Handler

To support enhanced routing rules, we're allowing a route to reference a handler module, which supports branching and pivoting logic based on data and metadata values.

```ts
import type { RouteHandlerCallback, Module } from 'lwr/router';

export default class RecordPageHandler {
    callback: RouteHandlerCallback;

    constructor(callback: RouteHandlerCallback) {
        this.callback = callback;
    }

    dispose(): void {}

    update(): void {
        this.callback({
            viewset: {
                default: (): Promise<Module> => import('example/home'),
            },
        });
    }
}
```

Route handlers in this example:

-   [homePageHandler](./src/modules/example/homePageHandler/homePageHandler.ts)
-   [namedPageHandler](./src/modules/example/namedPageHandler/namedPageHandler.ts)
-   [recipesPageHandler](./src/modules/example/recipesPageHandler/recipesPageHandler.ts)

For more details, see [RFC: Route Handler](https://rfcs.lwc.dev/rfcs/lwr/0002-route-handler).

### Navigate

In a LWC component, use the `NavigationContext` wire and `navigate` function from `lwr/navigation` to navigate.

```ts
import { LightningElement, wire } from 'lwc';
import { NavigationContext, navigate } from 'lwr/navigation';
import type { ContextId } from 'lwr/navigation';

export default class Example extends LightningElement {
    @wire(NavigationContext as any)
    navContext?: ContextId;

    pageReference = {
        type: 'home',
        attributes: {},
        state: {},
    };

    doNavigate(): void {
        if (this.pageReference && this.navContext) {
            navigate(this.navContext, this.pageReference);
        }
    }
}
```

See the link module example [here](./src/modules/example/link/link.ts).

### Error Handling

Sometimes the router navigation completes, but the component's new view contains an error. This is considered a successful navigation, so an `errornavigate` event doesn't fire. LWR handles this scenario in two ways:

1. Display an error slot in `lwr/outlet`.

```html
<lwr-outlet>
    <div slot="error">This content failed to display</div>
</lwr-outlet>
```

Or use a custom component

```html
<lwr-outlet>
    <div slot="error">
        <c-my-error></c-my-error>
    </div>
</lwr-outlet>
```

2. The `lwr/outlet` dispatches the `viewerror` event:

```html
<template>
    <lwr-router-container router="{router}">
        <lwr-outlet onviewerror="{onViewError}"></lwr-outlet>
    </lwr-router-container>
</template>
```

```ts
onViewError(viewErrorEvent: CustomEvent) {
    // handle viewerror
    const error: Error = viewErrorEvent.detail.error;
    const stack: string = viewErrorEvent.detail.stack;
    console.error(`error rendering view component: "${error.message}" from:\n${stack}`);
}
```

See the example [here](./src/modules/example/app/app.html) and [here](./src/modules/example/pageHasError/pageHasError.ts).

For more details, see the RFC for the outlet [here](https://rfcs.lwc.dev/rfcs/lwr/0003-router-api-baseline#lwr%2Foutlet) and the `viewerror` and `viewchange` events [here](https://rfcs.lwc.dev/rfcs/lwr/0000-router-viewChange-event).

### Configuration

Please note the routes defined in `lwr.config.json` are server-side; they are different from the `RouteDefinition` defined for the client-side router.

```json
//lwr.config.json
{
    "lwc": { "modules": [{ "dir": "$rootDir/src/modules" }] },
    "routes": [
        {
            "id": "app",
            "path": "/",
            "rootComponent": "example/app"
        },
        {
            "id": "named-page",
            "path": "/:namedPage",
            "rootComponent": "example/app"
        },
        {
            "id": "recipes",
            "path": "/:recipes/:title/:ingredients",
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
cd packages/simple-routing
yarn start
```

Open the site at [http://localhost:3000](http://localhost:3000)

See documentation for all commands [here](https://github.com/salesforce-experience-platform-emu/lwr-recipes/blob/main/doc/get_started.md).

## Heroku Deployment

```bash
# from the lwr-recipes root
./scripts/heroku-deploy.sh
```

The application would be deployed at [https://lwr-simple-routing.herokuapp.com/](https://lwr-simple-routing.herokuapp.com/)
