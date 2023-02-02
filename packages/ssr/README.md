# Server Side Rendering

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Project Setup](#project-setup)
    -   [Configuration](#configuration)
    -   [Root Components](#root-components)
    -   [Loading Data](#loading-data)
    -   [Code Portability](#code-portability)
-   [Recipe Setup](#recipe-setup)
    -   [Live](#live)
    -   [Generated](#generated)

## Introduction

The [Lightning Web Components (LWC)](https://lwc.dev/) framework supports Server Side Rendering (SSR). Usually, components are rendered on the client, but SSR enables rendering on the **server**. The main advantage of SSR is that component markup displays in the browser right away, resulting in faster time-to-content, especially on slower devices or internet connections.

This recipe is a Multi-Page App (MPA), with all pages being SSRed. This means that each page's HTML document contains all its markup and data. Users do not need to wait for the LWC and component JavaScript to download and execute before seeing the page content.

> Read more about SSR in LWR [here](https://github.com/salesforce-experience-platform-emu/lwr/blob/main/packages/%40lwrjs/lwc-ssr/README.md#overview).

## Details

### Project Setup

```
ssr
├── src
│   ├── assets/                     // static images and CSS
│   ├── layouts/
│   │   └── chrome.njk              // layout template for the pages
│   └── modules/
│       └── example/
│           ├── bookDetails/        // book details page root component
│           │   ├── bookDetails.css
│           │   ├── bookDetails.html
│           │   └── bookDetails.ts
│           ├── bookList/           // book list page root component
│           │   ├── bookList.css
│           │   ├── bookList.html
│           │   └── bookList.ts
│           ├── home/               // home page root component
│           │   ├── home.css
│           │   ├── home.html
│           │   └── home.ts
│           └── nav/                // navigation component (embedded in the layout template)
│               ├── nav.css
│               ├── nav.html
│               └── nav.ts
├── lwr.config.json                 // LWR app configuration
├── package.json                    // npm package configuration
└── tsconfig.json                   // typescript build configuration
```

### Configuration

This recipe contains three pages. Each page:

-   turns on SSR by setting `bootstrap.ssr` to `true`.
-   has a `rootComponent`, which is SSRed.
-   uses the _chrome.njk_ `layoutTemplate` (read more about templating [here](../templating/README.md#templates)).

The `staticSiteGenerator` object lists parameterized `books` routes to generate when this app is pre-built. Read more about static site generation [here](../static-generation/README.md#configuration).

The SSR `moduleProvider` and `viewTransformer` must be pulled in to handle the SSR processing.

```json
// ssr/lwr.config.json
{
    "lwc": { "modules": [{ "dir": "$rootDir/src/modules" }] },
    "moduleProviders": [
        "@lwrjs/app-service/moduleProvider",
        "@lwrjs/lwc-ssr/moduleProvider",
        "@lwrjs/lwc-module-provider",
        "@lwrjs/npm-module-provider"
    ],
    "viewTransformers": ["@lwrjs/base-view-transformer", "@lwrjs/lwc-ssr/viewTransformer"],
    "routes": [
        {
            "id": "home",
            "path": "/",
            "rootComponent": "example/home",
            "layoutTemplate": "$layoutsDir/chrome.njk",
            "bootstrap": {
                "ssr": true
            }
        },
        {
            "id": "books",
            "path": "/books/:author",
            "rootComponent": "example/bookList",
            "layoutTemplate": "$layoutsDir/chrome.njk",
            "bootstrap": {
                "ssr": true
            }
        },
        {
            "id": "books-details",
            "path": "/books/:author/:bookId",
            "rootComponent": "example/bookDetails",
            "layoutTemplate": "$layoutsDir/chrome.njk",
            "bootstrap": {
                "ssr": true
            }
        }
    ],
    "staticSiteGenerator": {
        "_additionalRoutePaths": [
            "/books/beverly+cleary",
            "/books/judy+blume",
            "/books/eleanor+estes",
            "/books/roald+dahl"
        ]
    }
}
```

### Root Components

> A "root component" is any lwc in a LWR app page's [content template, layout template](../templating/README.md#templates), or [`rootComponent` configuration](../../doc/config.md#routes).

In LWR, all root components (and their descendent components) are SSRed on each page where `bootstrap.ssr=true`.

If a root component in a content or layout template has attributes, these are passed to the component as [public properties](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reactivity_public). For example:

```html
<!-- ssr/src/layouts/chrome.njk -->
<!-- The "page" attribute gets passed as public property to "example/nav" -->
<example-nav page="{{page.id}}"></example-nav>
```

> Read more about building SSRed pages [here](https://github.com/salesforce-experience-platform-emu/lwr/blob/main/packages/%40lwrjs/lwc-ssr/README.md#building-ssr-pages).

### Loading Data

Many components depend on external data and resources. LWR provides a `getPageData()` hook for developers to fetch data on the server. During SSR, LWR calls the `getPageData()` hook for each **root component**. The `props` returned by the hook get passed to the root component as public properties during SSR **and** on the client. For example:

```ts
// ssr/src/modules/example/bookDetails/bookDetails.ts
export default class BookDetails extends LightningElement {
    // These public properties are bound to the "props" returned by getPageData() below
    @api data?: Book;
    @api bookId?: string;
}

export async function getPageData(context: SsrRequestContext): Promise<PageDataResponse> {
    // This is called to fetch data before the root component is SSRed
    const bookId = context.params.bookId; // The "bookId" path param is declared in lwr.config.json
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
    const data = await response.json();
    return {
        props: { data, bookId }, // Return public properties for the BookDetails component
        markup: {
            links: [
                {
                    // The thumbnail for the book is important, so the page will preload the image
                    href: data.volumeInfo.imageLinks.thumbnail,
                    as: 'image',
                    rel: 'preload',
                    fetchpriority: 'high',
                },
            ],
        },
    };
}
```

> Read more about data fetching [here](https://github.com/salesforce-experience-platform-emu/lwr/blob/main/packages/%40lwrjs/lwc-ssr/README.md#loading-data-during-ssr).

### Code Portability

> Code is _portable_ when it can run in a headless environment, where there is no access to browser APIs (eg: [window](https://www.w3schools.com/jsref/obj_window.asp), [eventing](https://www.w3schools.com/js/js_events.asp), etc).

Component code must be portable to SSR successfully. Note that:

-   only the `constructor` and `connectedCallback` are executed during SSR; the `renderedCallback` is **not** called.
-   asynchronous code is **not** resolved during SSR (e.g. `async`/`await`, Promises, [dynamic module imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import), etc)

Here are some tips to ensure component code is portable:

-   guard non-portable code with a conditional statement:

```ts
connectedCallback() {
    if (typeof window !== 'undefined') { // check the type of the browser API
        window.addEventListener('error', (evt) => {
            console.error(`⚠️ Uncaught error: ${evt.message}`);
        });
    }
}
```

-   put non-portable code in the `renderedCallback`:

```ts
renderedCallback() {
    document.title = 'Welcome!'; // does not need to be guarded
}
```

-   import non-portable code dynamically:

```ts
async connectedCallback() {
     const functions = await import('my/functions'); // will not resolve during SSR
     functions.doNonPortableWork();
}
```

> Read more about debugging SSR [here](https://github.com/salesforce-experience-platform-emu/lwr/blob/main/packages/@lwrjs/lwc-ssr/README.md#debugging).

## Recipe Setup

This recipe can be run live, or generated and served statically.

### Live

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/ssr
yarn start # prod mode and ESM format
```

Open the site at [http://localhost:3000](http://localhost:3000)

> See documentation for all commands [here](../../doc/get_started.md).

### Generated

The `build:static` commands pre-builds a subset of this recipe's pages:

-   the `home` page
-   the `books` pages specified as `_additionalRoutePaths` in [_lwr.config.json_](#configuration)

The `start:static` command starts the app using the pre-built resources. If a resource has **not** been pre-built (e.g. a book details page), then the request is processed by the live LWR server. See the [_start-static.mjs_ script](./scripts/start-static.mjs).

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/ssr
yarn build:static # statically generate the site in prod mode and ESM format
yarn start:static # serve the statically generated site
```

Open the site at [http://localhost:3000](http://localhost:3000)

> Read more about static site generation [here](../static-generation/README.md#configuration).
