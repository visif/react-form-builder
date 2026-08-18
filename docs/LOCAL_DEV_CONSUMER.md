# Local development — migration-vdc (parent project)

Use this when **migration-vdc** should consume a local build of `@visif/form-builder` during development. Nothing here affects the published library.

## Option A — `file:` dependency (recommended)

In **migration-vdc** `package.json`, point at the sibling repo (adjust path if needed):

```json
{
  "dependencies": {
    "@visif/form-builder": "file:../migration-react-form-builder"
  }
}
```

Then install and rebuild the library when it changes. Use **`build:local`** so the orange notice banner is included:

```bash
# migration-vdc
yarn install

# after editing migration-react-form-builder
yarn --cwd ../migration-react-form-builder build:local
```

**Before publish / CI:** restore the registry version:

```json
"@visif/form-builder": "^0.0.5"
```

Do not commit the `file:` override to main if your pipeline should always use the published package.

---

## Option B — Yarn link

In **migration-react-form-builder**:

```bash
yarn link:local
```

(`link:local` runs `build:local` then `yarn link`.)

In **migration-vdc**:

```bash
yarn link @visif/form-builder
```

After library changes:

```bash
yarn --cwd ../migration-react-form-builder build:local
```

Unlink when done:

```bash
# migration-vdc
yarn unlink @visif/form-builder && yarn install

# migration-react-form-builder
yarn unlink
```

---

## Local-build notice banner

`yarn build:local` / `yarn link:local` bake in `VITE_LOCAL_BUILD=true`. When that flag is set, `ReactFormBuilder` and `ReactFormGenerator` render a fixed orange badge:

`local @visif/form-builder · v{version}`

Publish builds (`yarn build`) never set the flag, so registry packages never show the banner. You can also read `IS_LOCAL_BUILD` from `@visif/form-builder` if the parent app needs to branch on it.

No parent-app label component is required.

---

## Optional scripts (migration-vdc)

```json
{
  "scripts": {
    "dev": "vite",
    "dev:local-fb": "yarn --cwd ../migration-react-form-builder build:local && vite",
    "build:local-fb": "yarn --cwd ../migration-react-form-builder build:local && vite build"
  }
}
```

Use `yarn dev:local-fb` when starting a session against a fresh local `dist/`.

---

## CSS import

Ensure **migration-vdc** still imports styles (same as production):

```js
import '@visif/form-builder/dist/app.css'
```

---

## Checklist

| Step | migration-vdc | migration-react-form-builder |
|------|---------------|------------------------------|
| Wire dependency | `file:../…` or `yarn link` | `yarn link:local` (link only) |
| Rebuild after edits | restart dev server if needed | `yarn build:local` |
| Notice banner | automatic when using local build | baked in by `build:local` |
| Publish / prod | registry version | `yarn build` → `npm publish` |
