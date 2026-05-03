# React 18 Demo (Build Artifacts)

This demo consumes the built output of the library directly from:

- `../../dist/app.es.js`
- `../../dist/app.css`

## Why this matches your request

- It uses **React 18+**
- It uses the **build version** of the library (not `src/`)

## Do I need to install Ant Design in the demo app?

Not separately for this setup.

`antd` is already a dependency of `@visif/form-builder` and is bundled as part of the library runtime dependencies used by `dist/app.es.js`.

## Run

```bash
cd examples/react18-demo
yarn
yarn dev
```

`yarn dev` automatically rebuilds library artifacts first via `predev`.

## Build

```bash
yarn build
```

`yarn build` also rebuilds library artifacts first via `prebuild`.
