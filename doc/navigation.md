# LWR Routing & Navigation

-   [Introduction](#introduction)
-   [App Configuration](#app-configuration)
-   [Router](#router)
    -   [Locations](#locations)
    -   [Route Definitions](#route-definitions)
    -   [Route Matching](#route-matching)
    -   [Route Handlers](#route-handlers)
-   [Router Container](#router-container)
    -   [Nesting Router Containers](#nesting-router-containers)
-   [Outlet](#outlet)
    -   [Multiple Outlets](#multiple-outlets)
-   [Navigation Wires](#navigation-wires)
    -   [`CurrentPageReference`](#currentpagereference)
    -   [`CurrentView`](#currentview)
    -   [`NavigationContext`](#navigationcontext)
-   [Navigation APIs](#navigation-apis)
    -   [`navigate()`](#navigate)
    -   [`generateUrl()`](#generateurl)
-   [Lightning Navigation](#lightning-navigation)
    -   [`NavigationMixin`](#navigationmixin)

## Introduction

The [`@lwrjs/router` package](https://github.com/salesforce/lwr/tree/master/packages/%40lwrjs/router) provides modules for client-side routing (`lwr/router`) and navigation (`lwr/navigation`), which export APIs to create a router, navigate, generate URLs and subscribe to navigation events. Client-side routing enables the creation of a Single Page Application (SPA).

LWR routers can be customized with configuration and hooks. They can also be nested, to create a hierarchy in an application.

> See the RFC on LWR routing APIs [here](https://rfcs.lwc.dev/rfcs/lwr/0003-router-api-baseline).

## App Configuration

The `@lwrjs/router` package is automatically available to all LWR applications. Add the following configuration to `lwr.config.json` to ensure that the modules are properly bundled:

```json
{
    "bundleConfig": {
        "exclude": ["lwr/navigation"]
    }
}
```

> Read more about bundle configuration [here](./config.md#bundling).

> _Important_: The `routes` array seen in LWR app configuration is for **server-side** routes (see RFC [here](https://rfcs.lwc.dev/rfcs/lwr/0000-lwr-app-config#application-routes)), and is unrelated to the `@lwrjs/router` package.

## Router

A router is a piece of code that manages client-side navigation changes. All navigation events flow through a router for processing. Use the `createRouter(config: RouterConfig)` API to initialize a LWR router:

```ts
import { createRouter } from 'lwr/router';
createRouter({
    routes: [
        /* see Route Definitions section */
    ],
    basePath: '/my-site',
    caseSensitive: true,
});
```

It takes a configuration object as an argument:

```ts
type RouterConfig = {
    routes?: RouteDefinition[]; // see Route Definitions section, default = []
    basePath?: string; // a path prefix applied to all URIs, default = ''
    caseSensitive?: boolean; // true if URIs should be processed case sensitively, default = false
};
```

### Locations

The router processes incoming navigation events (i.e. location changes), which enter the router in one of two forms:

1. **page references**: location in JSON form, passed to the router via the [`navigate()` API](#navigate)

```ts
interface PageReference {
    type: string;
    attributes: { [key: string]: string | null };
    state: { [key: string]: string | null };
}
```

2. **URI**: location in string form, as seen in a browser's address bar, and captured by the router via the [`popstate` event](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event)

The router uses its [route definitions](#route-definitions) to determine if a location is valid. If so, the navigation event is accepted and a user will see updated content in their browser.

The router can and does convert locations between forms. For example, the following URI and page reference are equivalent:

```json
// URI -> https://www.somewhere.com/animals/abc?view=compact&dark-mode

// page reference:
{
    "type": "animal_page",
    "attributes": {
        "animalId": "abc"
    },
    "state": {
        "view": "compact",
        "dark-mode": ""
    }
}
```

### Route Definitions

The most important part of the `RouterConfig` is the array of route definitions. The router uses these to verify and process incoming [location](#locations) changes. A location is only valid if it can be matched to a `RouteDefinition`. The application will fail to navigate given an invalid location. Each `RouteDefinition` has this shape:

```ts
interface RouteDefinition<TMetadata = Record<string, any>> {
    id: string;
    uri: string;
    page: Partial<PageReference>;
    handler: () => Promise<{ default: RouteHandler }>;
    patterns?: { [paramName: string]: string };
    exact?: boolean;
    metadata?: TMetadata;
}
```

containing the following properties:

-   `id`: each `RouteDefinition` must have a unique identifier
-   `uri`: a string pattern for URI locations which match this `RouteDefinition`; the grammar is fully defined [in an RFC](https://rfcs.lwc.dev/rfcs/lwr/0006-route-binding-and-serialization#uri-grammar-syntax) and includes these characters:
    -   `/`: path separator
    -   `:parameter`: captures a variable from a path or query parameter; must be alpha-numeric (i.e. [a-zA-Z0-9])
    -   `?`: denotes the beginning of the query string
    -   `&`: query parameter separator
-   `page`: shape for page references which match this `RouteDefinition`; the usage is detailed [in an RFC](https://rfcs.lwc.dev/rfcs/lwr/0006-route-binding-and-serialization#pagereference-binding) and allows:
    -   `:parameter` bindings: map a path or query parameter from the `uri` to an `attributes` or `state` property
    -   literal bindings: hard-code the `type`, an `attribute`, or `state` property to a literal value
-   `handler`: a `Promise` to a module which is called when a `RouteDefinition` is matched by a location; see the [Route Handlers section](#route-handlers)
-   `patterns` (optional): a regular expression which a parameter must match in order to be valid; described in an RFC [here](<https://rfcs.lwc.dev/rfcs/lwr/0006-route-binding-and-serialization#parameter-validation-(patterns)>)
-   `exact` (optional, default = `true`): see the [Nesting Router Containers section](#nesting-router-containers)
-   `metadata` (optional): developer-defined metadata attached to `RouteDefinition`; see the RFC [here](https://rfcs.lwc.dev/rfcs/lwr/0000-route-definition-meta) and a recipe [here](https://github.com/salesforce/lwr-recipes/tree/master/packages/routing-extended-metadata)

### Route Matching

Here is an example `RouteDefinition` for a recipe:

```js
// RouteDefinition for a page in a recipe website
{
    id: 'recipe',
    uri: '/recipes/:category/:recipeId?units=:units&yummy=yes',
    patterns: {
        recipeId: '[0-9]{3}',      // "recipeId" must be a 3 digit number
    },
    page: {
        type: 'recipe_page',       // matching page references must be of type "recipe_page"
        attributes: {
            recipeId: ':recipeId', // straightforward attribute binding
            cat: ':category',      // bind the "category" path parameter to the "cat" attribute
            units: ':units',       // bind the "units" query parameter to an attribute
        },
        state: {
            code: 'abc123',        // hard-coded state literal
        },
    },
    handler: () => import('my/recipeHandler'),
}
```

This URI and page reference match the recipe `RouteDefinition`:

```js
// URI -> https://www.somewhere.com/recipes/desserts/010?units=metric&yummy=yes&extra=foo (extra query params are allowed)

// page reference:
{
    "type": "recipe_page", // type matches
    "attributes": {
        // all bound attributes have values
        "recipeId": "010", // the "recipeId" matches the pattern
        "cat": "desserts",
        "units": "metric"
    },
    "state": {
        "code": "abc123", // the state literal matches
        "extra": "foo"    // extra state properties are allowed
    }
}
```

This URI and page reference **do not** match:

```js
// URI -> https://www.somewhere.com/r/desserts/abc (parameters and literals are missing or malformed)

// page reference:
{
    "type": "awful_page", // type DOES NOT match
    "attributes": {
        "recipeId": "lol", // the "recipeId" DOES NOT match the pattern
        "extra": "bad" // extra attributes ARE NOT allowed
        // the "cat" and "units" attributes are missing
    },
    "state": {
        "code": "fail" // the state literal IS NOT equal
    }
}
```

> See more `RouteDefinition` examples with [matching](https://rfcs.lwc.dev/rfcs/lwr/0006-route-binding-and-serialization#positively-matching-pagereferences%3A) and [non-matching](https://rfcs.lwc.dev/rfcs/lwr/0006-route-binding-and-serialization#failing-matching-pagereferences%3A) page references in the RFC.

### Route Handlers

When the router [matches](#route-matching) an incoming [location (i.e. URI or page reference)](#locations) to a [`RouteDefinition`](#route-definitions), it accesses its `RouteDefinition.handler` to determine the associated "view". A view is the component to display when the application navigates to a location.

```ts
// types related to the RouteHandler
interface RouteDefinition {
    handler: () => Promise<{ default: RouteHandler }>; // `export default` a RouteHandler module
    // other properties...
}
interface RouteHandler {
    new (callback: (routeDestination: RouteDestination) => void): void; // denotes a Class
    dispose(): void;
    update(routeInfo: RouteInstance): void;
}
interface RouteDestination {
    // provided by `RouteHandler.update()` via a callback
    viewset: ViewSet;
}
interface ViewSet {
    [namedView: string]: (() => Promise<Module>) | ViewInfo;
}
interface ViewInfo {
    module: () => Promise<Module>;
    specifier: string;
}
interface RouteInstance {
    // location information passed to `RouteHandler.update()`
    id: string; // RouteDefinition.id
    attributes: { [key: string]: string | null };
    state: { [key: string]: string | null };
    pageReference: PageReference;
}
```

> _Note_: Modules are always provided via promises. This allows the module code to be lazily loaded, which improves performance of the application.

Given information on the current location (i.e. a `RouteInstance`), the job of the `RouteHandler` module is to provide a set of views via a callback from its `update()` function:

```ts
// "my/recipeHandler" RouteHandler module
import type { Module, RouteHandlerCallback } from 'lwr/router';

export default class RecipeHandler {
    callback: RouteHandlerCallback;

    constructor(callback: RouteHandlerCallback) {
        this.callback = callback; // Important: maintain a reference to the callback
    }

    dispose(): void {
        // perform cleanup tasks
    }

    update(routeInfo: RouteInstance): void {
        // called every time a RouteDefinition with this handler matches a location during processing
        const {
            attributes: { cat }, // location information
        } = routeInfo;
        const category = cat || 'entree'; // cat may be null
        const viewSpecifier = `my/${category}Recipe`; // e.g. "my/dessertRecipe"
        this.callback({
            viewset: {
                // return view component info based on the recipe's category
                default: {
                    module: (): Promise<Module> => import(viewSpecifier),
                    specifier: viewSpecifier,
                },
            },
        });
    }
}
```

> See the `RouteHandler` RFC [here](https://rfcs.lwc.dev/rfcs/lwr/0002-route-handler) and some example handlers [here](https://github.com/salesforce/lwr-recipes/tree/master/packages/simple-routing/src/modules/example).

## Router Container

In order to use a [router](#router) in an application, it must be attached to the DOM. This is done with a router container, provided by the `lwr-router-container` component.

A router container provides "navigation context", meaning that it is responsible for [processing](#route-matching) all navigation [wires](#navigation-wires) and [events](#navigation-apis) from its descendants in the DOM (e.g. `my-nav` and `lwr-outlet` in the example code below).

```html
<!-- my/app/app.html -->
<template>
    <lwr-router-container
        router="{router}"
        onhandlenavigation="{handleNavigation}"
        onprenavigate="{preNavigate}"
        onpostnavigate="{postNavigate}"
        onerrornavigate="{errorNavigate}"
    >
        <my-nav></my-nav>
        <lwr-outlet><!-- See the Outlet section below --></lwr-outlet>
    </lwr-router-container>
</template>
```

```ts
// my/app/app.ts
import { LightningElement } from 'lwc';
import { createRouter } from 'lwr/router';
import { ROUTE_DEFINITIONS } from './routeDefinitions';

export default class MyApp extends LightningElement {
    router = createRouter({ routes: ROUTE_DEFINITIONS });
    approvedCategories = ['apps', 'entrees', 'sides', 'desserts'];

    handleNavigation(e: CustomEvent): void {
        console.log('navigate() called with page reference:', e.detail);
    }

    preNavigate(e: CustomEvent): void {
        const {
            next: {
                route: { pageReference },
            },
        } = e.detail;
        const {
            attributes: { cat },
        } = pageReference;
        console.log('navigation event incoming with page reference:', pageReference);
        if (!this.approvedCategories.includes(cat)) {
            // REJECT unapproved recipe categories
            e.preventDefault();
        }
    }

    postNavigate(e: CustomEvent): void {
        const {
            route: { pageReference },
        } = e.detail;
        console.log('navigated to page reference:', pageReference);
    }

    errorNavigate(e: CustomEvent): void {
        const { code, message } = e.detail;
        console.error(`navigation error -> ${code}: ${message}`);
    }
}
```

A router container requires a [router](#router), and fires these events:

-   `handlenavigation`: dispatched when [`navigate(pageRef)`](#navigate) is called; `event.preventDefault()` **cancels** the navigation event; `event.detail` is the `PageReference`
-   `prenavigate`: dispatched when a navigation event is received and a `RouteDefinition` match is found; `event.preventDefault()` **cancels** the navigation event; `event.detail` is a `RouteChange`
-   `postnavigate`: dispatched when a navigation event has completed; `event.detail` is a `DomRoutingMatch` for the current location
-   `errornavigate`: dispatched when there is an error processing a navigation event (e.g. no `RouteDefinition` match, `prenavigate` cancelation); `event.detail` is a `MessageObject`

```ts
// router container event payload types
interface DomRoutingMatch {
    url: string; // e.g. "/recipes/desserts/010?units=metric&yummy=yes"
    route: RouteInstance;
    routeDefinition: RouteDefinition;
}
interface RouteChange {
    current?: DomRoutingMatch; // the current location info
    next: DomRoutingMatch; // location info for the incoming nav event
}
interface MessageObject {
    code: string | number;
    message: string;
    level: number; // Fatal = 0, Error = 1, Warning = 2, Log = 3
}
```

> See a simple routing recipe [here](https://github.com/salesforce/lwr-recipes/tree/master/packages/simple-routing).

### Nesting Router Containers

A router container can have up to 1 child router. Each router is responsible for processing the navigation events from its descendants. Every [`RouteDefinition`](#route-definitions) resolving to a view component which includes a child router must set `exact` to `false`:

```js
// parent RouteDefinition for a page which includes a child router
{
    id: 'root',
    uri: '/parent/path',
    exact: false, // allow the parent and child router to resolve a URI together (i.e. "/parent/path/child/path&params)
    page: { type: 'home' },
    handler: () => import('my/someHandler'), // resolves a view containing a child router container
}
```

> See a nested routing recipe [here](https://github.com/salesforce/lwr-recipes/tree/master/packages/nested-routing).

## Outlet

It is the router's job to [resolve view components](#route-handlers) for a given location, and it is the outlet's job to _display_ those view components:

```html
<!-- my/app/app.html -->
<template>
    <lwr-router-container>
        <lwr-outlet refocus-off onviewchange="{onViewChange}" onviewerror="{onViewError}"></lwr-outlet>
    </lwr-router-container>
</template>
```

The outlet uses the [`CurrentView` wire](#currentview) to get the current view component, then displays it in the DOM. It has these properties:

-   `onviewchange` event: dispatched whenever the view component changes; `event.detail` is the view component class:

```ts
type Constructor<T = object> = new (...args: any[]) => T;
interface Constructable<T = object> {
    constructor: Constructor<T>;
}
interface ViewChangePayload {
    detail: Constructable;
}
```

-   `onviewerror` event: dispatched whenever the view component fails to mount; `event.detail` is the error and stack:

```ts
interface ViewErrorPayload {
    detail: {
        error: Error;
        stack: string;
    };
}
```

-   `refocus-off` boolean: if present, the outlet will **not** put the browser focus on the view component when it loads; refocusing is on by default as an accessibility feature
-   `view-name`: the key of the `ViewSet` entry to display; the default value is `"default"`

> See the RFC for the outlet [here](https://rfcs.lwc.dev/rfcs/lwr/0003-router-api-baseline#lwr%2Foutlet) and the `viewchange` and `viewerror` events [here](https://rfcs.lwc.dev/rfcs/lwr/0000-router-viewChange-event).

### Multiple Outlets

A [`RouteHandler`](#route-handlers) may return multiple views:

```ts
import type { Module, RouteHandlerCallback } from 'lwr/router';

export default class HomeHandler {
    callback: RouteHandlerCallback;

    constructor(callback: RouteHandlerCallback) {
        this.callback = callback;
    }

    dispose(): void {}

    update(): void {
        this.callback({
            viewset: {
                // return multiple views
                default: (): Promise<Module> => import('my/home'),
                nav: (): Promise<Module> => import('my/homeNav'),
                footer: (): Promise<Module> => import('my/homeInfo'),
            },
        });
    }
}
```

Multiple outlets can be used to display all the current view components by setting different `view-names`:

```html
<!-- my/app/app.html -->
<template>
    <lwr-router-container>
        <lwr-outlet view-name="nav"></lwr-outlet>
        <lwr-outlet><!-- default view --></lwr-outlet>
        <lwr-outlet view-name="footer"></lwr-outlet>
    </lwr-router-container>
</template>
```

## Navigation Wires

The `lwr/navigation` module provides [wire adapters](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.data_wire_service_about) from which components can receive information about navigation events.

### `CurrentPageReference`

Get the current page reference from the [router container](#router-container):

```js
import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lwr/navigation';

export default class Example extends LightningElement {
    // Subscribe to page reference updates
    @wire(CurrentPageReference)
    printPageName(pageRef) {
        console.log(`Page name: ${pageRef ? pageRef.attributes.name : ''}`);
    }
}
```

> _Note_: This wire is also available in [Lightning Experience](https://developer.salesforce.com/docs/component-library/bundle/lightning-navigation/documentation).

### `CurrentView`

Get a reference to the current view component. The `viewName` configuration property is optional, and falls back to `"default"` if unspecified.

```js
import { LightningElement, wire } from 'lwc';
import { CurrentView } from 'lwr/navigation';

export default class MyFooter extends LightningElement {
    // Subscribe to view component updates
    @wire(CurrentView, { viewName: 'footer' })
    viewCtor;
}
```

### `NavigationContext`

Get a reference to a component's navigation context (i.e. its closest ancestor [router container](#router-container)), for use with the [navigation APIs](#navigation-apis):

```ts
import { LightningElement, wire } from 'lwc';
import { NavigationContext } from 'lwr/navigation';
import type { ContextId } from 'lwr/navigation';

export default class Example extends LightningElement {
    @wire(NavigationContext as any)
    navContext?: ContextId;
}
```

## Navigation APIs

### `navigate()`

Navigate programmatically:

```ts
import { LightningElement, api, wire } from 'lwc';
import { NavigationContext, navigate } from 'lwr/navigation';
import type { ContextId } from 'lwr/navigation';

export default class AboutLink extends LightningElement {
    @wire(NavigationContext as any)
    navContext?: ContextId;

    handleClick(event: Event): void {
        event.preventDefault();
        if (this.navContext) {
            navigate(this.navContext, {
                type: 'named_page',
                attributes: { name: 'about' },
            });
        }
    }
}
```

### `generateUrl()`

Generate a URL for a page reference:

```ts
import { LightningElement, api, wire } from 'lwc';
import { NavigationContext, generateUrl } from 'lwr/navigation';
import type { ContextId, PageReference } from 'lwr/navigation';

export default class UrlGenerator extends LightningElement {
    @api pageReference?: PageReference;

    @wire(NavigationContext as any)
    navContext?: ContextId;

    connectedCallback(): void {
        if (this.pageReference && this.navContext) {
            const url = generateUrl(this.navContext, this.pageReference);
            console.log(`"${url}" is the URL for this page reference:`, this.pageReference);
        }
    }
}
```

## Lightning Navigation

The `@lwrjs/router` package provides an implementation of [`lightning/navigation`](http://component-library-dev.herokuapp.com/docs/component-library/bundle/lightning-navigation/documentation), which defines the `NavigationMixin` and the `CurrentPageReference` wire adapter. This allows a component to be written once and plugged in anywhere that supports the `lightning/navigation` contracts.

The `lightning/navigation` module is an [alias](https://rfcs.lwc.dev/rfcs/lwc/0020-module-resolution#aliasmodulerecord) for the `lwr/navigation` module, so it includes the same [wires](#navigation-wires) and [APIs](#navigation-apis), along with the [`NavigationMixin`](#navigationmixin).

### `NavigationMixin`

Some developers may prefer to use the `NavigationMixin` over the [`navigate()` and `generateUrl()` APIs](#navigation-apis). Both offer the same functionality, but only the `NavigationMixin` is compatible with Lightning Experience (LEX). So a developer writing a component for use in both LWR and LEX should choose the `NavigationMixin`.

```js
import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

const pageRef = {
    type: 'standard__recordPage',
    attributes: {
        recordId: '001xx000003DGg0AAG',
        objectApiName: 'Account',
        actionName: 'view',
    },
};

export default class Example extends NavigationMixin(LightningElement) {
    // Navigate to a page reference
    navPageRef() {
        this[NavigationMixin.Navigate](pageRef);
    }
    // Generate a URL for a page reference
    getUrl() {
        this[NavigationMixin.GenerateUrl](pageRef).then((url) => console.log(url));
    }
}
```
