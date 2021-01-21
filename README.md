# Lightning Web Runtime Recipes

Lightning Web Runtime (LWR) is a flexible platform that supports a wide range of different web applications. Its features are composable and pluggable. LWR at its simplest is a non-opinionated way to load the modules you need for your use case. Some benefits of LWR out of the box are:

- Performance. Our bar is set at sub-second full page loads.
- Enjoyable local development experience.
- All the power of LWC and the Salesforce platform at your disposal.

This repo consists of a collection of sample projects, called recipes, for LWR ([source](https://github.com/salesforce/lwr)). Each recipe demonstrates how to code a specific use case. From Hello World to Single Page Applications to resource bundling and chunking, there is a recipe for that!

If you'd like to contribute to this project, see our [contributing guide](./doc/CONTRIBUTING.md).

## Sample projects

All sample projects are installed when you clone this repo. Go to a recipe to learn more about how to run and configure that particular sample project:
- Barebones [Hello World](./packages/hello-world)
- Single Page Application (SPA) with [Simple Routing](./packages/simple-routing)
- Including [SLDS and Base Components](./packages/base-slds)
- SPA with [Nested Routing](./packages/nested-routing)
- Creating a [Custom Module Provider](./packages/module-provider)
- Configuring a [Bootstrap Init Override](./packages/init-override)

## Documentation

Additional LWR documentation is split between this repo and the [LWR code repo](https://github.com/salesforce/lwr), depending on the audience.

- [Contributing Guide](./doc/CONTRIBUTING.md)
- [Business Overview](./doc/business_overview.md)

## Getting started

Load and run a recipe in your local environment by following these getting started steps.

### Requirements

This project uses [Volta](https://volta.sh/) to ensure that all the contributors share the same version of `Node` and `Yarn` for development. Even if you aren't contributing to this project and are running and configuring recipes for your own use only, we recommend installing `Volta` before you install `Node` and `Yarn`.

 * [Node](https://nodejs.org/) >=14.15.1 <15
 * [Yarn](https://yarnpkg.com/) >= 1.22.5

 *We use [yarn](https://yarnpkg.com/) because it is significantly faster than npm for our use case. See this command [cheatsheet](https://yarnpkg.com/lang/en/docs/migrating-from-npm/).*

### Clone the repository

```bash
git clone git@github.com:salesforce/lwr-recipes.git
cd lwr-recipes
```
### Install project dependencies

```bash
yarn install
```

If this command fails with an error about *UNABLE_TO_GET_ISSUER_CERT_LOCALLY*, *Error: unable to get local issuer certificate*, or a registry communication issue then verify that the yarn installation was successful.

### Build all LWR recipes

```bash
yarn build
```

### Run a LWR recipe

Navigate to your chosen recipe and run the recipe. Using `hello-world` for example:

```bash
cd packages/hello-world
yarn start
```

Open the site at [http://localhost:3000](http://localhost:3000)

**Note**: Recipes can be started in three different modes:

| Mode        | Start Command     | Format | File Watch         | Bundling            | Minify              |
| ----------- | ----------------- |:------:|:------------------:|:-------------------:|:-------------------:|
| dev         | `yarn start`      | ESM    | :white_check_mark: | :no_entry_sign:     | :no_entry_sign:     |
| prod        | `yarn start:prod` | ESM    | :no_entry_sign:    | :white_check_mark:  | :white_check_mark:* |
| compat      | `yarn start:amd`  | AMD    | :white_check_mark: | :no_entry_sign:     | :no_entry_sign:     |

### Clean a LWR recipe

Cleaning a recipe removes the build directory and file cache. This command is useful if you run into errors or have a stale project.

```bash
yarn clean
```

## Contact Us

Post in the `#lwr-js-help` Slack channel.

## License

The [license](/PLACEHOLDER) governs your use of LWR.
