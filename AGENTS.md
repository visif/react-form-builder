# AI Agent Guide — @visif/form-builder

This is a **publishable React library** (not an app). Consumers import `ReactFormBuilder` and `ReactFormGenerator` from `dist/`. Read this before making changes.

## What this project is

- **Package:** `@visif/form-builder` — drag-and-drop form designer + form renderer
- **Stack:** React 18 (hooks only), Vite 6, TypeScript public API, Ant Design 6, SCSS
- **Source of truth:** `src/` → build output in `dist/` via `yarn build`
- **Do not** treat this like a Next.js/Tailwind/Zustand app — those are not used here

## Architecture

Three layers:

| Layer | Path | Role |
|-------|------|------|
| **Builder** | `src/components/builder/` | Canvas: `ReactFormBuilder`, `Preview`, `Toolbar`, `ElementEditor` |
| **Generator** | `src/components/generator/` | Renderer: `ReactFormGenerator`, validation, submission |
| **Form elements** | `src/components/form-elements/` | Shared field components (`inputs/`, `display/`, `advanced/`, `uploads/`, `shared/`) |

**State:** `useReducer` + React Context in `src/contexts/FormBuilderContext.tsx` (builder) and `src/contexts/FormContext.tsx` (generator). Form values are collected via FormContext — do not reintroduce legacy ref-based DOM collection.

**Registry:** Custom elements register via `Registry` singleton (`src/utils/registry.ts`). `Registry.register(name, Component)` throws on duplicates.

**Public API:** `src/index.tsx` exports `ReactFormBuilder`, `ReactFormGenerator`, `Registry`, `FORM_BUILDER_VERSION`. Types in `src/types/form.ts`.

## Commands

Use **Yarn v1** only. Keep `yarn.lock` as the lockfile.

```bash
yarn              # install
yarn dev          # Vite playground (src/dev.jsx)
yarn build        # dist/ for publish or local linking
yarn link:local   # build + yarn link (for migration-vdc dev)
yarn lint         # ESLint
yarn test         # Vitest
```

Parent project (**migration-vdc**) local dev: [docs/LOCAL_DEV_CONSUMER.md](./docs/LOCAL_DEV_CONSUMER.md).

CI (`.github/workflows/ci.yml`) runs lint → test → build on push/PR.

**Publish:** `yarn build` then `npm publish` to GitHub Packages (`@visif:registry`).

## Coding conventions

- **Functional components only** — no class components
- **Named exports** for the public API; default export is the `FormBuilders` object
- State updates use `immutability-helper` — never mutate context state in place
- Memoize handlers passed as props with `useCallback` when appropriate
- Public API and new utilities: TypeScript (`.ts`/`.tsx`)
- Internal form elements may remain `.jsx` — migrate incrementally when touching a file
- `ElementEditor` logic stays under its own `configs/`, `editors/`, `hooks/`, `utils/`
- SCSS in `scss/`; shared tokens in `scss/variables.scss`
- `react` and `react-dom` are **peer dependencies** — externalized in Vite; never pin them as direct library imports
- Props support both snake_case (legacy) and camelCase via `src/utils/propAliases.ts`
- Prefer `Signature2` over deprecated canvas `Signature`

## Integrations

- **react-dnd v16** — `useDrag` / `useDrop` for builder drag-and-drop
- **Ant Design v6** — UI primitives (DatePicker, Select, etc.)
- **react-quill-new** — rich text fields
- **hot-formula-parser** — `FormulaInput` calculations
- **xss** — sanitize HTML before render (see Security)

## Security

- User HTML must pass through `src/utils/xss.ts` before rendering
- Do not add `dangerouslySetInnerHTML` without that sanitizer

## Testing

- Vitest + Testing Library in `src/**/*.test.ts`
- Run `yarn test` after logic changes; expand tests when fixing bugs

## Scope discipline

- Minimize diff scope — this is a library; avoid unrelated refactors
- Do not add markdown/docs unless asked
- Do not commit unless explicitly requested
- `dist/` is build output — edit `src/`, not `dist/`

## Key files

| File | Purpose |
|------|---------|
| `src/index.tsx` | Public exports |
| `src/types/form.ts` | Shared TypeScript types |
| `src/utils/registry.ts` | Custom element registry |
| `src/utils/propAliases.ts` | camelCase ↔ snake_case props |
| `vite.config.js` | Library build (ES + UMD + dts) |
| `examples/react18-demo/` | Local consumer demo |

## Historical docs

`docs/MIGRATION_*.md` and `docs/AUDIT_RESULTS.md` are archives from the webpack → Vite migration. Prefer this file and `README.md` for current behavior.
