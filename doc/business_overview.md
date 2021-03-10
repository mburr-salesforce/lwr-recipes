# Introduction to Lightning Web Runtime (LWR)

Lightning Web Runtime (LWR) is a flexible platform that supports a wide range of different web applications. Its features are composable and pluggable. LWR at its simplest is a non-opinionated way to configure and load the modules, services, and dependency providers to meet your use case.

LWR describes any configurable aspects of the application in a well-defined, portable format. Because of this flexible deployment model, you can deploy on a variety of runtime environments, depending on your use case. For example, LWR works in a local NodeJS runtime, as a stand-alone instance in Heroku, or as a Java runtime deployed and configured for an opinionated platform.

## Server Runtime

The LWR server runtime provides a framework of APIs and services which serve all the modules needed by your app definition. The server also contains view providers for compiling and serving your static templates.

The LWR server is configured in `lwr.config.json`, at the root of your project.

## Client Runtime

The client runtime provides all the resources you need to host a compiled app in the execution environment, typically a browser. The client runtime includes routing APIs for managing navigation and loader APIs for managing any special code that runs as modules are loaded into your app.

## Available Packages

The following table maps all available LWR packages to recipes so you can see how they're used. To use a package in your LWR app, add it as a dependency in `package.json`. If the package is a module provider, add it to the list of module providers in `lwr.config.json`.

| Package Name          | Description                                                                   | Is Module Provider? | Recipes that Use Package                                                                                                                                                                                                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| label-module-provider | Pulls labels from JSON files and returns them as ES modules for localization  | Yes                 | [labels](https://github.com/salesforce/lwr-recipes/tree/master/packages/labels)                                                                                                                                                                                                                                         |
| router                | Uses the router API to add navigation capabilities to your app                | No                  | [nested routing](https://github.com/salesforce/lwr-recipes/tree/master/packages/nested-routing), [simple routing](https://github.com/salesforce/lwr-recipes/tree/master/packages/simple-routing), [routing-extended-metadata](https://github.com/salesforce/lwr-recipes/tree/master/packages/routing-extended-metadata) |
| shared-utils          | Helpers used for advanced functionality, like writing custom module providers | No                  | [module provider](https://github.com/salesforce/lwr-recipes/tree/master/packages/module-provider)                                                                                                                                                                                                                       |

Learn more in [Configure a LWR Project](./config.md).
