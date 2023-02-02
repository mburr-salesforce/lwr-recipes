# Instrumentation Metrics in AMD

-   [Introduction](#introduction)
-   [Details](#details)
    -   [Project Setup](#project-setup)
    -   [Metrics](#metrics)
    -   [Reading Metrics](#reading-metrics)
    -   [Recording Metrics](#recording-metrics)
    -   [Configuration](#configuration)
    -   [Dispatcher Override](#dispatcher-override)
-   [Recipe Setup](#recipe-setup)

## Introduction

LWR applications running in [AMD format](https://en.wikipedia.org/wiki/Asynchronous_module_definition) (`compat` or `prod-compat` mode) with [fingerprints](https://rfcs.lwc.dev/rfcs/lwr/0000-fingerprints) collect metrics for:

-   LWR bootstrap (i.e. [AMD shim](https://rfcs.lwc.dev/rfcs/lwr/0000-lwr-bootstrap#amd-loader%2Floader-shim))
-   the LWR AMD module loader (i.e. [`@lwrjs/loader`](https://github.com/salesforce-experience-platform-emu/lwr/tree/main/packages/%40lwrjs/loader))

LWR application developers can view, record and process this instrumentation data.

## Details

### Project Setup

```
src/
  ├── modules/
  │   └── example/
  │       ├── a/             // test module
  │       ├── app/           // the root application
  │       |   ├── app.css
  │       |   ├── app.html
  │       |   └── app.ts
  │       ├── b/             // another test module
  │       ├── c/             // a third test module
  │       └── metricsSink/   // metrics bootstrap service
  │           └── metricsSink.ts
  └── index.ts               // includes middleware to field requests from "example/metricsSink"
lwr.config.json
```

### Metrics

The following metrics are collected during [LWR bootstrap](https://rfcs.lwc.dev/rfcs/lwr/0000-lwr-bootstrap):

| Name                  | Purpose                                                                                                                                                                                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lwr.bootstrap.end`   | Marks when the LWR Client Runtime has **successfully finished** bootstrapping an application, which is orchestrated by the [AMD shim](https://rfcs.lwc.dev/rfcs/lwr/0000-lwr-bootstrap#amd-loader%2Floader-shim). This will happen 0 or 1 times per page load.                     |
| `lwr.bootstrap.error` | Marks when an error occurs during application bootstrap. Since all bootstrap errors are **fatal** and cause the script to [enter its error state](https://rfcs.lwc.dev/rfcs/lwr/0000-lwr-bootstrap#error-handling-and-timeouts), this will only happen 1 or 0 times per page load. |

these metrics are collected when using the [LWR Router](https://github.com/salesforce-experience-platform-emu/lwr-recipes/blob/main/doc/navigation.md):

| Name                       | Purpose                                                                                                                                                                                                                                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `lwr.router.navigate.<id>` | Marks when a navigation event occurs in the browser.                                                                                                                                                                                                                                                                           |
| `lwr.router.view.<id>`     | Marks when a [view component](https://github.com/salesforce-experience-platform-emu/lwr-recipes/blob/main/doc/navigation.md#route-handlers) is to be loaded in response to a navigation event.                                                                                                                                 |
| `lwr.router.error`         | Marks whenever an error occurs in the router. This most likely occurs if an incoming navigation event cannot be matched to a [Route Definition](https://github.com/salesforce-experience-platform-emu/lwr-recipes/blob/main/doc/navigation.md#route-definitions), or the corresponding view component is missing or malformed. |

and these metrics are collected by the [AMD loader](https://github.com/salesforce-experience-platform-emu/lwr/tree/main/packages/%40lwrjs/loader):

| Name                                    | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lwr.loader.module.define.<specifier>`  | Marks when the loader adds a particular module to its registry. Each module can only be defined once. The module registry should contain one entry for each module defined in the application.                                                                                                                                                                                                                                                                                                    |
| `lwr.loader.module.fetch.<specifier>`   | Marks when the loader fetches a particular module from the server **or** by calling a [`loadModule` hook](https://rfcs.lwc.dev/rfcs/lwr/0000-lwr-loader-hooks#loadmodulehook). It **does not** include any modules fetched outside of the loader (e.g. from a `<script>` tag). If a module has been fetched more than once, it has been [invalidated](https://rfcs.lwc.dev/rfcs/lwr/0000-lwr-module-invalidation-hooks) and fetched again.                                                        |
| `lwr.loader.mappings.fetch.<specifier>` | Marks when the loader fetches a particular mappings object from the server **or** by calling a [`loadMapping` hook](https://rfcs.lwc.dev/rfcs/lwr/0000-lwr-loader-hooks#loadmappinghook). **Important**: This metric is only applicable when [fingerprints](https://rfcs.lwc.dev/rfcs/lwr/0000-fingerprints) are enabled in the LWR server.                                                                                                                                                       |
| `lwr.loader.module.error.<specifier>`   | Marks when the AMD Loader encounters an error fetching modules. This happens for loader errors **not** caused by the user (i.e. application developer). User errors include unresolvable module specifiers, unparseable module code, and invalid [`loadModule` hooks](https://rfcs.lwc.dev/rfcs/lwr/0000-lwr-loader-hooks#loadmodulehook).                                                                                                                                                        |
| `lwr.loader.mappings.error.<specifier>` | Marks when the AMD Loader encounters an error fetching mappings. This happens for loader errors **not** caused by the user (i.e. application developer). User errors include unresolvable mapping specifiers, unparseable mapping JSON, and invalid [`loadMapping` hooks](https://rfcs.lwc.dev/rfcs/lwr/0000-lwr-loader-hooks#loadmappinghook). **Important**: This metric is only applicable when [fingerprints](https://rfcs.lwc.dev/rfcs/lwr/0000-fingerprints) are enabled in the LWR server. |

### Reading Metrics

By default, LWR instrumentation records metrics using the browser's [Performance API marks](https://developer.mozilla.org/en-US/docs/Web/API/Performance). The [`example/app` component](./src/modules/example/app/app.ts) processes the metrics recorded by bootstrap and the loader. Upon construction, it reads the **existing** metrics using code like this:

```ts
import { BOOTSTRAP_PREFIX, BOOTSTRAP_END, BOOTSTRAP_ERROR } from 'lwr/metrics';
if (globalThis.performance !== undefined) {
    // Gather all marks
    const marks = globalThis.performance
        .getEntriesByType('mark')
        .filter((e) => e.name.startsWith(BOOTSTRAP_PREFIX));

    // Get successful bootstrap count (should be 1 or 0)
    const count = bootstrapMarks.reduce((count, mark) => {
        return mark.name === BOOTSTRAP_END ? count + 1 : count;
    }, 0);

    // Get bootstrap error count (should be 0 or 1)
    const errors = marks.reduce((count, mark) => {
        return mark.name === BOOTSTRAP_ERROR ? count + 1 : count;
    }, 0);

    // Calculate availability %
    const availability = count !== 0 ? ((count - errors) / count) * 100 : 0;
}
```

then it listens for any **incoming** metrics:

```ts
if (PerformanceObserver) {
    // Watch for new metrics
    const observer = new PerformanceObserver((list) => {
        const marks = list.getEntries();
        // Process new marks here...
    });
    observer.observe({ entryTypes: ['mark'] });
}
```

> _Note_: By the time any components are loaded, all bootstrap metrics have already been recorded. So the `PerformanceObserver` is only listening for loader metrics in `example/app`.

### Recording Metrics

LWR application developers may want to record metrics. The [`example/metricsSink` module](./src/modules/example/metricsSink/metricsSink.ts) listens for metrics from the Performance API, then sends them to the server at [_index.ts_](./src/index.ts).

The `example/metricsSink` module is set up as a [bootstrap service/hook](https://rfcs.lwc.dev/rfcs/lwr/0000-lwr-app-config#client-bootstrap-config). Its code will be run just before the root application component (i.e. `example/app`) is initialized [during bootstrap](https://rfcs.lwc.dev/rfcs/lwr/0000-lwr-bootstrap#application-bootstrap-module).

### Configuration

Add the `example/metricsSink` module as a [bootstrap service](https://rfcs.lwc.dev/rfcs/lwr/0000-lwr-app-config#client-bootstrap-config) in `lwr.config.json`.

```json
{
    "lwc": { "modules": [{ "dir": "$rootDir/src/modules" }] },
    "routes": [
        {
            "id": "metrics",
            "path": "/",
            "rootComponent": "example/app",
            "bootstrap": {
                "services": ["example/metricsSink"]
            }
        }
    ]
}
```

### Dispatcher Override

The Performance API is not available in some environments (e.g. [V8](https://v8.dev/docs)), or an application developer may want to use a different storage mechanism for metrics. In these cases, developers can add a custom dispatcher to handle metrics themselves, and the Performance API will **not** be used. The dispatcher function is called every time LWR logs a metric, and is set using a [`customInit` hook](https://rfcs.lwc.dev/rfcs/lwr/0000-lwr-bootstrap#custominit-hook):

```ts
// Definitions for attaching a custom dispatcher
const enum Phase {
    Start = 0,
    End = 1,
}
interface LWRDispatcherInfo {
    id: LWRMetric;
    specifier?: string;
    phase: Phase;
}
type LogDispatcher = (info: LWRDispatcherInfo) => void;
interface CustomInitAPI {
    attachDispatcher: (dispatcher: LogDispatcher) => void;
    // Other APIs go here...
}
```

Where `LWRMetric` is one of the [names defined by LWR](#metrics) (excluding any `.<specifier>` suffixes):

```ts
// These strings are available as constants from the "lwr/metrics" module
type LWRMetric =
    | 'lwr.bootstrap.end'
    | 'lwr.bootstrap.error'
    | 'lwr.loader.module.define'
    | 'lwr.loader.module.fetch'
    | 'lwr.loader.mappings.fetch'
    | 'lwr.loader.module.error'
    | 'lwr.loader.mappings.error';
```

A `customInit` hook is implemented by a developer with a static script in the application HTML, for example:

```ts
// my-static-resource.js
globalThis.LWR = globalThis.LWR || {};
Object.assign(globalThis.LWR, {
    customInit: (lwr: CustomInitAPI): void => {
        // This function is called every time LWR logs a metric
        lwr.attachDispatcher(({ opId, phase, specifier }: LWRDispatcherInfo): void => {
            const suffix = specifier ? `.${specifier}` : '';
            const metricName = `${opId}${suffix}`;
            // send metricName to the server or other storage location
            console.log(`LWR METRIC: ${metricName} in phase ${phase}`);
        });

        // Pass control back to LWR bootstrap
        lwr.initializeApp();
    },
});
```

## Recipe Setup

```bash
# from the lwr-recipes root
yarn install
yarn build
cd packages/metrics
yarn start # prod-compat mode and AMD format
yarn start:compat # compat mode and AMD format
```

Open the site at [http://localhost:3000](http://localhost:3000)
