# Project Guidelines — @visif/form-builder

## Architecture

Three-layer component model:

| Layer             | Location                        | Role                                                                             |
| ----------------- | ------------------------------- | -------------------------------------------------------------------------------- |
| **Builder**       | `src/components/builder/`       | Drag-and-drop canvas (`ReactFormBuilder`, `Preview`, `Toolbar`, `ElementEditor`) |
| **Generator**     | `src/components/generator/`     | Form renderer (`ReactFormGenerator`, `FormValidator`)                            |
| **Form Elements** | `src/components/form-elements/` | Field components shared by both layers                                           |

Form elements are organized by category — `inputs/`, `display/`, `advanced/`, `uploads/`, `shared/` — and aggregated into a single plain `FormElements` object in [`src/components/form-elements/index.jsx`](../src/components/form-elements/index.jsx).

State is managed via `useReducer` + `createContext` in [`src/contexts/FormBuilderContext.jsx`](../src/contexts/FormBuilderContext.jsx). External handler refs (`saveUrlRef`, `onPostRef`, etc.) use `useRef` to avoid re-renders; a subscriber pattern in `useEffect` notifies listeners on state change.

## Code Style

- **Functional components only** — the codebase was migrated from class components; never reintroduce class components.
- **Named exports** for public API (see [`src/index.jsx`](../src/index.jsx)).
- State mutations use `immutability-helper`; do not mutate state directly.
- Use `useCallback` to memoize handlers passed as props.
- Custom elements are registered via the `Registry` singleton in [`src/utils/registry.js`](../src/utils/registry.js) — `Registry.register(name, Component)` throws on duplicates.

## Package Manager

- **Use Yarn v1 (classic) for all workspace commands.**
- Do not use `npm install` for dependency installation in this repository.
- Keep `yarn.lock` as the source of truth for dependency resolution.

## Build and Test

```bash
yarn                 # install dependencies
yarn dev             # start Vite dev server (entry: src/dev.jsx)
yarn build           # Vite library build → dist/app.es.js + dist/app.umd.js
yarn build:style     # compile SCSS → dist/app.css
yarn build:lib       # build + build:style
yarn transpile       # Babel → lib/ (legacy output, rarely needed)
yarn format          # Prettier over src/**
```

No test suite is currently configured — do not fabricate test commands.

## Project Conventions

- **`src/` is the source of truth.** `lib/` mirrors it as transpiled output from a prior Babel step — edit only `src/`.
- **Dual file:` src/` uses `.jsx`, `lib/` uses `.js`** — when reading code look in `src/`.
- `ElementEditor` has its own scoped `configs/`, `editors/`, `hooks/`, and `utils/` subdirectories — keep new editor-side logic there.
- SCSS lives in `scss/`; per-library overrides are in dedicated files (e.g., `react-select.scss`). Shared tokens are in `variables.scss`.
- Peers (`react`, `react-dom`) are externalized in the Vite build; **never import them inside library code via a direct version pin**.

## Integration Points

- **react-dnd v16** (hooks API: `useDrag`, `useDrop`) handles all drag-and-drop.
- **Ant Design v5** is the UI component library (DatePicker, Slider, TimePicker, etc.) — Bootstrap is no longer used.
- **react-quill-new** powers rich-text editing inside form elements.
- **hot-formula-parser** is used by `FormulaInput`.
- Published to GitHub Packages registry as `@visif/form-builder`; configure `.npmrc` with `@visif:registry=https://npm.pkg.github.com` and `//npm.pkg.github.com/:_authToken=<TOKEN_WITH_write:packages>`.
- Publish with `npm publish` (uses `prepublishOnly` to build artifacts before publishing).

## Security

- User-supplied HTML content must pass through the `xss` utility in [`src/utils/xss.js`](../src/utils/xss.js) before rendering.
- Do not introduce `dangerouslySetInnerHTML` without wrapping content with that utility.
