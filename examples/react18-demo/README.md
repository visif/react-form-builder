# React 18 Demo (Build Artifacts)

This demo consumes the built output of the library directly from:

- `../../dist/app.es.js`
- `../../dist/app.css`

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

For testing inside **migration-vdc** with a dev-only label, see [../../docs/LOCAL_DEV_CONSUMER.md](../../docs/LOCAL_DEV_CONSUMER.md).
