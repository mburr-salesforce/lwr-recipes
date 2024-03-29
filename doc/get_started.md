# Get Started

Run a recipe in your local environment by following these steps.

## Requirements

This project uses [Volta](https://volta.sh/) to ensure that all the contributors share the same version of Node and Yarn for development. Even if you aren't contributing to this project and are running and configuring recipes for your own use only, we recommend installing Volta before you install Node and Yarn.

-   [Node](https://nodejs.org/) >=14.16.0 <17
-   [Yarn](https://yarnpkg.com/) >= 1.22.5

_We use [Yarn](https://yarnpkg.com/) because it is significantly faster than npm for our use case. See this command [cheatsheet](https://yarnpkg.com/lang/en/docs/migrating-from-npm/)._

## Clone the Repository

```bash
git clone git@github.com:salesforce/lwr-recipes.git
cd lwr-recipes
```

## Install Project Dependencies

```bash
yarn install
```

If this command fails with an error about _UNABLE_TO_GET_ISSUER_CERT_LOCALLY_, _Error: unable to get local issuer certificate_, or a registry communication issue then verify that the yarn installation was successful.

## Build All LWR Recipes

```bash
yarn build
```

## Run an LWR Recipe

Navigate to your chosen recipe and run the recipe. Using `hello-world` for example:

```bash
cd packages/hello-world
yarn start
```

Open the site at [http://localhost:3000](http://localhost:3000)

Recipes can be started in four different modes:

| Mode        | Start Command            | Format |     File Watch     |      Bundling      |       Minify       |
| ----------- | ------------------------ | :----: | :----------------: | :----------------: | :----------------: |
| dev         | `yarn dev`               |  ESM   | :white_check_mark: |  :no_entry_sign:   |  :no_entry_sign:   |
| prod        | `yarn start`             |  ESM   |  :no_entry_sign:   | :white_check_mark: | :white_check_mark: |
| compat      | `yarn start:compat`      |  AMD   | :white_check_mark: |  :no_entry_sign:   |  :no_entry_sign:   |
| prod-compat | `yarn start:prod-compat` |  AMD   |  :no_entry_sign:   | :white_check_mark: | :white_check_mark: |

### Hot Reloading

Running a recipe in [`dev` mode](https://github.com/salesforce/lwr-recipes/blob/master/doc/get_started.md#run-an-lwr-recipe) uses hot reloading for easier debugging, so when you change a component in one place it updates immediately. In `dev` mode, the server registers all file paths and watches them individually.

## Clean an LWR Recipe

Cleaning a recipe removes the build directory and file cache. This command is useful if you run into errors or have a stale project.

```bash
yarn clean
```
