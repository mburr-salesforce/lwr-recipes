# Lightning Web Runtime Recipes

Lightning Web Runtime (LWR) is a flexible platform that supports a wide range of different web applications. Its features are composable and pluggable. LWR at its simplest is a non-opinionated way to load the modules you need for your use case. Some benefits of LWR out of the box are:

- Performance. Our bar is set at sub-second full page loads.
- Enjoyable local development experience.
- All the power of LWC and the Salesforce platform at your disposal.

## Sample Projects

This repo consists of a collection of sample projects, called recipes, for LWR ([source](https://github.com/salesforce/lwr)). Each recipe demonstrates how to code a specific use case. From Hello World to Single Page Applications to resource bundling and chunking, there is a recipe for that!

All recipes are installed when you clone this repo. Go to a recipe to learn more about how to run and configure it:
- Barebones [Hello World](./packages/hello-world)
- Single Page Application (SPA) with [Simple Routing](./packages/simple-routing)
- Including [SLDS and Base Components](./packages/base-slds)
- SPA with [Nested Routing](./packages/nested-routing)
- Creating a [Custom Module Provider](./packages/module-provider)
- Configuring a [Bootstrap Init Override](./packages/init-override)
- Securing an App with [Locker](./packages/locker)
- Localizing an App with [Labels](./packages/labels)

## Create a project

LWR doesn't yet have a `create` command, so the easiest way to start building your own project is to copy one of the recipes and modify the copy. If you'd like to contribute to this project, see our [contributing guide](./doc/CONTRIBUTING.md).

## Documentation

Additional LWR documentation is in the `/doc` folder.

- [Contributing Guide](./doc/CONTRIBUTING.md)
- [Business Overview](./doc/business_overview.md)

## Getting Started

Load and run a recipe in your local environment by following the [getting started](./doc/getting_started.md) steps.

## Contact Us

Post in the `#lwr-js-help` Slack channel.

## Request Features

To request a feature or recipe, or to report an issue, [open an issue](https://github.com/salesforce/lwr-recipes/issues) in Github.
