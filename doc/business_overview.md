# Overview of Building LWR Apps

-   [Overview of Building LWR Apps](#overview-of-building-lwr-apps)
    -   [Benefits of a Lightning Web Runtime (LWR) App](#benefits-of-a-lightning-web-runtime-lwr-app)
        -   [LWR and Experience Cloud](#lwr-and-experience-cloud)
        -   [Future of LWR](#future-of-lwr)
    -   [Server Runtime](#server-runtime)
    -   [Client Runtime](#client-runtime)

## Benefits of a Lightning Web Runtime (LWR) App

Lightning Web Runtime (LWR) is a flexible [Jamstack](https://jamstack.org/) architecture built on Node.js that supports a wide range of end-to-end modern digital experiences. Out of the box, LWR provides many built-in features:

-   Development environment with hot module reload (HMR)
-   Configurable module bundling
-   Customizable page-based routing
-   Client-side routing
-   Static site generation (SSG) with Markdown support

In addition to all of the built-in features, you can also include external dependencies such as:

-   Client-side security (Locker)
-   Accessible design systems like Salesforce Lightning Design System (SLDS)
-   Lightning Data Service (LDS)

LWR is also the runtime for your Lightning Web Component (LWC) applications. With LWR, you have all the power of the Salesforce platform at your disposal.

### LWR and Experience Cloud

Salesforce uses a version of LWR to power its template-based Experience Builder sites. If you're building or customizing an Experience Builder site, access LWR through our Experience Cloud template, known as the Build Your Own (LWR) template.

To learn more, see [LWR Sites for Experience Cloud](https://developer.salesforce.com/docs/atlas.en-us.exp_cloud_lwr.meta/exp_cloud_lwr/intro.htm).

### Future of LWR

In addition to using LWR to power Experience Cloud, Salesforce is starting to build more of its apps on LWR. Eventually you'll be able to deploy your LWR apps to the platform, just like you do today with server-side Aura apps.

## Server Runtime

The LWR server runtime provides a framework of APIs and services which serve all the modules needed by your app definition. The server also contains view providers for compiling and serving your static templates.

The LWR server is configured in `lwr.config.json`, at the root of your project.

## Client Runtime

The client runtime provides all the resources you need to host a compiled app in the execution environment, typically a browser. The client runtime includes routing APIs for managing navigation and loader APIs for managing any special code that runs as modules are loaded into your app. App components are served up to the execution environment from where they live in your file structure. You can also generate modules at runtime or bundle components to optimize performance.
