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

Then install and rebuild the library when it changes:

```bash
# migration-vdc
yarn install

# after editing migration-react-form-builder
yarn --cwd ../migration-react-form-builder build
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

In **migration-vdc**:

```bash
yarn link @visif/form-builder
```

After library changes:

```bash
yarn --cwd ../migration-react-form-builder build
```

Unlink when done:

```bash
# migration-vdc
yarn unlink @visif/form-builder && yarn install

# migration-react-form-builder
yarn unlink
```

---

## Dev-only label (migration-vdc side)

Add a visible banner in the **parent app** so you can tell you are not on the published package. The library itself stays unchanged.

### 1. Env flag (dev only)

`.env.development.local` in **migration-vdc**:

```ini
VITE_USE_LOCAL_FORM_BUILDER=true
```

Do not set this in production builds. Vite strips `import.meta.env.DEV` in production.

### 2. Label component

Create e.g. `src/components/LocalFormBuilderDevLabel.jsx` in **migration-vdc**:

```jsx
import { FORM_BUILDER_VERSION } from '@visif/form-builder'

const LocalFormBuilderDevLabel = () => {
  if (!import.meta.env.DEV || import.meta.env.VITE_USE_LOCAL_FORM_BUILDER !== 'true') {
    return null
  }

  return (
    <div
      aria-label="Using local form-builder build"
      data-dev-local-form-builder
      style={{
        position: 'fixed',
        bottom: 8,
        right: 8,
        zIndex: 10000,
        padding: '4px 10px',
        borderRadius: 4,
        fontSize: 11,
        fontFamily: 'ui-monospace, Menlo, monospace',
        color: '#fff',
        backgroundColor: '#b45309',
        pointerEvents: 'none',
      }}
    >
      local @visif/form-builder · v{FORM_BUILDER_VERSION}
    </div>
  )
}

export default LocalFormBuilderDevLabel
```

Mount once in your app shell (e.g. root layout):

```jsx
import LocalFormBuilderDevLabel from './components/LocalFormBuilderDevLabel'

export default function App() {
  return (
    <>
      <LocalFormBuilderDevLabel />
      {/* rest of app */}
    </>
  )
}
```

The orange badge only appears when `DEV` + `VITE_USE_LOCAL_FORM_BUILDER=true`. Production builds never show it.

### 3. Optional scripts (migration-vdc)

```json
{
  "scripts": {
    "dev": "vite",
    "dev:local-fb": "yarn --cwd ../migration-react-form-builder build && vite",
    "build:local-fb": "yarn --cwd ../migration-react-form-builder build && vite build"
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
| Rebuild after edits | restart dev server if needed | `yarn build` |
| Dev label | `.env.development.local` + `LocalFormBuilderDevLabel` | — |
| Publish / prod | registry version, no env flag | `yarn build` → `npm publish` |
