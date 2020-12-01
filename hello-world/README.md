# Hello World Example

## Features

### Concepts

- A barebones LWR v2 application with no extras

### Files

- lwc modules at [src/modules/](./src/modules)
- server creation at [scripts/start-server.mjs](./scripts/start-server.mjs)
- static resources at [src/assets/](./src/assets)
- LWR configuration at [lwr.config.json](./lwr.config.json)

## Commands

### Installation

```bash
npm install
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
# remove the file cache
npm run clean
```
