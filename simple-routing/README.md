# Simple Routing Example

## Features

### Concepts

- Use the [`@lwrjs/router`](https://github.com/salesforce/lwr/tree/master/packages/%40lwrjs/router) package to create a Single Page Application that exercises the simple routing case.

### Files

- LWC modules at [src/modules/](./src/modules)
- LWR configuration at [lwr.config.json](./lwr.config.json)

## Commands

### Install and Build

```bash
npm install
npm run build
```

### Run

```bash
# in prod mode and ESM format
npm start
```
```bash
# in compat mode and AMD format
npm run start:amd
```
Open the site at [http://localhost:3000](http://localhost:3000)

### Clean

```bash
# remove the build directory and file cache
npm run clean
```
