# Templating

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Project Setup](#project-setup)
    -   [Templates](#templates)
    -   [Context](#context)
    -   [Configuration](#configuration)
        -   [Template Locations](#template-locations)
        -   [Hooks](#hooks)
-   [Recipe Setup](#Recipe-setup)
-   [Heroku Deployment](#heroku-deployment)

## Introduction

LWR supports the configuration of content and layout templates for each [route](https://github.com/salesforce-experience-platform-emu/lwr-recipes/blob/main/doc/config.md#routes) in an application. LWR renders the response for a page request given the current [route templates](#templates) and [context](#context).

```json
// route with templates in lwr.config.json
{
    "id": "home",
    "path": "/",
    "contentTemplate": "$contentDir/home.html",
    "layoutTemplate": "$layoutsDir/main_layout.njk"
}
```

## Details

### Project Setup

```
src/
  ├── assets/     // static resources
  │   ├── css/
  │   └── images/
  ├── content/    // page content templates
  ├── data/       // global template context data
  ├── hooks/      // programmatic app configuration
  ├── layouts/    // layout templates
  ├── modules/
  │   └── namespace/
  │       └── name/
  │           ├── name.css
  │           ├── name.html
  │           └── name.js
  └── index.ts
```

### Templates

LWR supports the following languages for templating:

-   [HTML](https://en.wikipedia.org/wiki/HTML)
-   [Markdown](https://www.markdownguide.org/)
-   [Nunjucks](https://mozilla.github.io/nunjucks/)

Additionally, templates in LWR can utilize the following resources when creating dynamic content:

-   [Asset](https://github.com/salesforce-experience-platform-emu/lwr-recipes/blob/main/doc/config.md#assets) References
-   Embedded [LWCs](https://lwc.dev/)
-   [Context](#context) Object (HTML and Nunjucks templates **only**)

Here are examples which add a logo asset, embed the `c/info` component, and use the `someText` context property:

```html
<!-- html -->

<h1>Some Topic</h1>

<img src="$assetsDir/images/logo.svg" alt="logo" />
<c-info message="{{someText}}"></c-info>
```

```markdown
<!-- markdown -->

# Some Topic

![logo]($assetsDir/images/logo.svg 'logo')
<c-info message="static string"></c-info>
```

```njk
{# Nunjucks #}

<h1>Some Topic</h1>

<img src="$assetsDir/images/logo.svg" alt="logo" />
<c-info message="{{someText}}"></c-info>
```

### Context

The context that LWR passes into HTML and Nunjucks [templates](#templates) contains data from several locations. This data is merged into a single object in this order:

-   [Global Data](#global-data)
-   [Front Matter](#front-matter)
-   [Page Information](#page-information)
-   [Markdown Metadata](#markdown-metadata)
-   [Static Route Properties](#static-route-properties)
-   [Route Handler Params](#route-handler-params)
-   [LWR](#lwr)

**Important**: Context is not passed into Markdown templates unless `viewParams` are set via a [custom route handler](#route-handler-params).

#### LWR

The LWR framework automatically passes these two context properties:

-   `lwr_resources`: a string containing all the scripts needed to run an application, such as the LWC library and [LWR client resources](https://rfcs.lwc.dev/rfcs/lwr/0000-lwr-bootstrap#lwr-framework-client-resources); embedded LWCs don't render if this string is excluded from the page response
-   `body`: available in layout templates, a string containing the rendered page content that is output from the [route's](#configuration) `contentTemplate` or `rootComponent`

Here are examples of HTML and Nunjucks layout templates which use both properties:

```html
<!-- $layoutsDir/main.html -->
<!doctype html>
<html>
    <head></head>
    <body>
        <!-- triple braces prevents HTML escaping -->
        {{{body}}} {{{lwr_resources}}}
    </body>
</html>
```

```njk
{# $layoutsDir/main.njk #}
<!DOCTYPE html>
<html>
    <head></head>
    <body>
        {# the "safe" filter prevents HTML escaping #}
        {{ body | safe }}
        {{ lwr_resources | safe }}
    </body>
</html>
```

> See these properties being used in [_layouts/main_layout.njk_](./src/layouts/main_layout.njk).

#### Global Data

You can pass static global context into all HTML or Nunjucks templates within an application from the file system.

```
src/
  └── data/     // global template context data
      ├── site/
      │   └── navbar.json
      └── global.json
```

```json
// $rootDir/src/data/global.json
{
    "siteTitle": "LWR Docs"
}
```

```json
// $rootDir/src/data/site/navbar.json
[
    {
        "id": "guide",
        "name": "Guide",
        "url": "/guide/introduction"
    },
    {
        "id": "recipes",
        "name": "Recipes",
        "url": "/recipes"
    }
]
```

This global data is then added to the context.

```json
// context object
{
    "global": {
        "siteTitle": "LWR Docs"
    },
    "site": {
        "navbar": [
            {
                "id": "guide",
                "name": "Guide",
                "url": "/guide/introduction"
            },
            {
                "id": "recipes",
                "name": "Recipes",
                "url": "/recipes"
            }
        ]
    }
}
```

> See `global.siteTitle` being used in [_layouts/main_layout.njk_](./src/layouts/main_layout.njk).

> See `site.navbar` being used in [_layouts/partials/navbar.njk_](./src/layouts/partials/navbar.njk).

#### Front Matter

LWR reads front matter out of each HTML/Nunjucks template and adds it to the context. These properties are local to the template. The following properties have special meaning:

-   **layoutTemplate**: set the layout template inside a content template; this is overridden by the `layoutTemplate` set on the [route](#configuration). This property also works for Markdown templates.
-   **immutable**: set this to `false` if the template contents are mutable; the default is `true`. Nunjucks templating allows mutable constructs to be embedded in a template's content, e.g. [random](https://mozilla.github.io/nunjucks/templating.html#random) and [cycler](https://mozilla.github.io/nunjucks/templating.html#cycler-item1-item2-itemn). Due to this capability, the templates that leverage these features can and should mark the template as mutable so LWR can modify the cacheability of the page response.

```njk
---
custom: 9000
someText: Good to see you
immutable: false
layoutTemplate: $layoutsDir/main_layout.njk
---
{# $rootDir/src/content/home.njk #}
<p>{{someText}}</p>
<p>{{custom}}</p>
It is now {{ now | date('dddd, MMMM Do YYYY, h:mm:ss a') }}
```

> See local front matter being used in [_content/echo.html_](./src/content/echo.html).

> See `layoutTemplate` front matter being used in [_content/recipes.md_](./src/content/recipes.md).

#### Page Information

LWR passes information about the page from the current route and request.

-   **id**: `route.id`
-   **title**: set to the first defined value of the following:
    -   `properties.title` from the [route](#static-route-properties) or `viewParams.title` from the [route handler](#route-handler-params)
    -   filename from `route.contentTemplate`
    -   "LWR App"
-   **url**: the request URL, relative to the origin

_Example 1_: When the current browser location is `http://localhost:3000/` and the route is:

```json
// route in lwr.config.json
{
    "id": "home_page",
    "path": "/",
    "contentTemplate": "$contentDir/home.html",
    "layoutTemplate": "$layoutsDir/main_layout.njk"
}
```

then the page information is:

```json
// context object
{
    "page": {
        "id": "home_page",
        "title": "home",
        "url": "/"
    }
}
```

_Example 2_: When the current browser location is `http://localhost:3000/recipes?sort=desc` and the route is:

```json
// route in lwr.config.json
{
    "id": "recipes",
    "path": "/recipes",
    "contentTemplate": "$contentDir/recipes.md",
    "properties": {
        "title": "Recipes Repository"
    }
}
```

then the page information is:

```json
// context object
{
    "page": {
        "id": "recipes",
        "title": "Recipes Repository",
        "url": "/recipes?sort=desc"
    }
}
```

The object is accessible via the `page` context variable in the HTML/Nunjucks templates:

```njk
{# $layoutsDir/layout.njk shows the page title and a logo on the home page #}
<!DOCTYPE html>
<html>
    <head>
        <title>{{page.title}}</title>
    </head>
    <body>
        {% if page.id === 'home_page' %}
            <img src="$assetsDir/images/logo.svg" alt="logo" />
        {% endif %}

        {{ body | safe }}
        {{ lwr_resources | safe }}
    </body>
</html>
```

> See the `page` context being used in the [layouts](./src/layouts) for this recipe.

#### Markdown Metadata

Markdown content templates produce context on their headings, which can be accessed from an HTML or Nunjucks layout template. Information on each heading starting with two or more `#` is included. For example:

```markdown
## Topic 1

### Sub-topic

#### Grandchild
```

produces:

```json
// context object
{
    "headings": [
        {
            "text": "Topic 1",
            "slug": "topic-1"
        },
        {
            "text": "Sub-Topic",
            "slug": "sub-topic"
        },
        {
            "text": "Grandchild",
            "slug": "granchild"
        }
    ]
}
```

The object is accessible via the `headings` context property in HTML/Nunjucks layout templates:

```njk
{# $layoutsDir/partials/nav.njk shows a link for each heading #}
<ul>
    {% for mdHeading in headings %}
        <li><a href="#{{mdHeading.slug}}">{{mdHeading.text}}</a></li>
    {% endfor %}
</ul>
```

> See the `headings` context being used in a [sidebar](./src/layouts/partials/recipes-sidebar.njk).

#### Static Route Properties

You can pass static context into HTML/Nunjucks templates from a route via its `properties`:

```json
// route with properties in lwr.config.json
{
    "id": "about",
    "path": "/about",
    "contentTemplate": "$contentDir/about.html",
    "properties": {
        "someText": "Lorem ipsum dolor sit amet"
    }
}
```

```html
<!-- $contentDir/about.html shows the route property -->
<h2>About</h2>
<p>{{someText}}</p>
```

> See the `intro` route property being used in [_content/echo.html_](./src/content/echo.html).

#### Route Handler Params

**Warning**: This is an advanced topic.

You can customize the page response using a route handler. A route handler is a function which is configured for a route.

```json
// route with a handler in lwr.config.json
{
    "id": "custom_route_handler",
    "path": "/custom/:param",
    "routeHandler": "$rootDir/src/routeHandlers/custom.ts"
}
```

The route handler function has this shape:

```ts
type RouteHandlerFunction = (
    viewRequest: LocalizedViewRequest,
    handlerContext: HandlerContext,
) => Promise<RouteHandlerViewResponse>;

// Request: given GET http://www.example.com/custom/foobar?sort=desc
interface LocalizedViewRequest {
    url: string; // "/custom/foobar?sort=desc
    requestPath: string; // "/custom/foobar"
    locale?: string;
    params?: Record<string, string>; // { "param": "foobar" }
    query?: Record<string, undefined | string | string[]>; // { "sort": "desc" }
}

// Handler context, passed into the route handler function
interface HandlerContext {
    route: LwrRoute | LwrErrorRoute; // the current route from lwr.config.json
    viewApi: RouteHandlerViewApi; // functions to call into the LWR server
}
interface RouteHandlerViewApi {
    // interact with the LWR rendered page view cache
    hasViewResponse(view: RouteHandlerView, viewParams?: Record<string, Json>): boolean;
    getViewResponse(
        view: RouteHandlerView,
        viewParams?: Record<string, Json>,
    ): Promise<RouteHandlerViewResponse | undefined>;
}
type RouteHandlerView = Pick<LwrRoute, 'contentTemplate' | 'layoutTemplate' | 'rootComponent'>;

// Response
type RouteHandlerViewResponse = ViewDefinitionResponse | ViewResponse;
interface ViewDefinitionResponse {
    // customize response input handled by the LWR server
    status?: number; // HTTP status
    view: RouteHandlerView; // a partial route
    viewParams: Record<string, Json>; // passed into the templates as dynamic context
    renderOptions?: RenderOptions;
    cache?: CacheResponse;
    headers?: Record<string, string>; // HTTP headers
}
interface ViewResponse {
    // return a completely custom response override
    status?: number; // HTTP status
    body: Buffer | string | boolean | Json; // response body
    cache?: CacheResponse;
    headers?: Record<string, string>; // HTTP headers
}
interface RenderOptions {
    skipMetadataCollection?: boolean; // skip parsing of body for <link> and <img> tags, default = false
    freezeAssets?: boolean; // true if immutable URLs should be constructed for embedded assets, default = runtimeEnvironment.immutableAssets
    skipCaching?: boolean; // true if the page view response should not be cached, default = false
}
interface CacheResponse {
    ttl?: string | number; // "max-age" for the "Cache-Control" header
}
```

Things to note:

-   The dynamic `ViewDefinitionResponse.viewParams` are available in Markdown content templates, unlike the static properties described in the other [context](#context) sections above.
-   All the `ViewDefinitionResponse.viewParams` are added to the cache key for a page view response, so be mindful of how many items are added to this object in order to keep the cache size down.
-   The `ViewDefinitionResponse.viewParams` replaces the [static route properties](#static-route-properties), so if the `properties` are needed, merge them in with the `viewParams` in the route handler function.
-   The `CacheResponse.ttl` is a number, in seconds, or a [time string](https://github.com/vercel/ms#examples) to use as the `max-age` on the [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) header.
-   The `ViewDefinitionResponse.view` is merged with `{ id, bootstrap }` from the current route.

> See an example of customizing a page response [here](./src/routeHandlers/echo.ts). The LWR server then constructs the response.

> See an example of overriding a page response [here](./src/routeHandlers/custom.ts).

### Configuration

Most templating configuration takes place in the routes. See the examples above and the [route](https://github.com/salesforce-experience-platform-emu/lwr-recipes/blob/main/doc/config.md#routes) and [error route](https://github.com/salesforce-experience-platform-emu/lwr-recipes/blob/main/doc/config.md#error-routes) configuration documentation.

To avoid validation errors, each route must have either a `rootComponent` or a `contentTemplate`, but not both. If a `rootComponent` is used, a default `contentTemplate` is applied in order to render it.

#### Template Locations

The directory locations of [global context data](#global-data), content/layout templates, and assets are configurable:

```json
// lwr.config.json
{
    "contentDir": "$rootDir/templates",
    "layoutsDir": "$rootDir/layouts",
    "globalDataDir": "$rootDir/src/context",
    "assets": [
        {
            "dir": "$rootDir/src/assets",
            "urlPath": "/public/assets"
        }
    ]
}
```

> See additional information on [directory configuration](https://github.com/salesforce-experience-platform-emu/lwr-recipes/blob/main/doc/config.md#more-configuration) and [assets](https://github.com/salesforce-experience-platform-emu/lwr-recipes/blob/main/doc/config.md#assets).

#### Hooks

**Warning**: This is an advanced topic.

You can write code that dynamically updates the [configuration](https://github.com/salesforce-experience-platform-emu/lwr-recipes/blob/main/doc/config.md#configuration) and [global data](#global-data) for an application upon startup. The locations of configuration hooks are set like this:

```json
// lwr.config.json
{
    "hooks": ["$rootDir/src/hooks/docs-app-hooks.js"]
}
```

> See an example of a configuration hook [here](./src/hooks/docs-app-hooks.ts).

## Recipe Setup

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/templating
yarn start # prod mode and ESM format
```

Open the main site at [http://localhost:3000](http://localhost:3000).

Run a [route handler](#route-handler-params) at [http://localhost:3000/echo/Hello!](http://localhost:3000/echo/Hello!). "Hello!" can be replaced with any message, and be echoed in the page.

See a [custom response](#route-handler-params) at [http://localhost:3000/json/path-param?foo=query-param](http://localhost:3000/json/path-param?foo=query-param). The `path-param` and `query-param` can be replaced with any string, and be reflected in the JSON output.

See documentation for all commands [here](https://github.com/salesforce-experience-platform-emu/lwr-recipes/blob/main/doc/get_started.md).

## Heroku Deployment

```bash
# from the lwr-recipes root
./scripts/heroku-deploy.sh
```

The application would be deployed at [https://lwr-templating.herokuapp.com/](https://lwr-templating.herokuapp.com/)
