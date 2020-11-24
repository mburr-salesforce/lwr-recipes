# Bootstrap Init Overrides

## Features

### Concepts

- Override the [bootstrap `init` function](https://github.com/salesforce/lwr/blob/master/packages/%40lwrjs/client-modules/modules/lwr/init/README.md).

### Files

- lwc modules at [src/modules/](./src/modules)
- LWR configuration at [lwr.config.json](./lwr.config.json)
- server creation in TypeScript at [src/index.ts](./src/index.ts)
- `init()` override at [src/modules/example/init/init.js](./src/modules/example/init/init.js)

## Commands

### Install and Build

```bash
npm install
npm run build
```

### Run

```bash
# in dev mode
npm start
```
```bash
# in prod mode
npm run start:prod
```
- Open the site at [http://localhost:3000](http://localhost:3000)
- See information on the browser page

### Clean

```bash
# remove the build directory and file cache
npm run clean
```