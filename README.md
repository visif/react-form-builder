# @visif/form-builder

A React form builder with drag-and-drop, built for React 18 with Vite and hooks.

## Installation

```bash
npm install @visif/form-builder
```

### Configure `.npmrc`

```ini
@visif:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## Usage

### Form Builder (Design Mode)

```jsx
import { ReactFormBuilder } from '@visif/form-builder'
import '@visif/form-builder/dist/app.css'

const Designer = () => (
  <ReactFormBuilder onPost={(data) => saveForm(data)} />
)
```

### Form Generator (Fill Mode)

```jsx
import { ReactFormGenerator } from '@visif/form-builder'
import '@visif/form-builder/dist/app.css'

const FormView = ({ formData, answers }) => (
  <ReactFormGenerator
    data={formData}
    answer_data={answers}
    onSubmit={(data) => console.log(data)}
  />
)
```

### Custom Elements

```jsx
import { Registry } from '@visif/form-builder'

Registry.register('MyWidget', MyWidgetComponent)
```

## Requirements

- React 18+
- Node.js 18+

## Exports

| Export | Description |
|--------|-------------|
| `ReactFormBuilder` | Drag-and-drop form designer |
| `ReactFormGenerator` | Form renderer with validation |
| `Registry` | Register custom form elements |
| `FORM_BUILDER_VERSION` | Current package version string |

TypeScript declaration files are published in `dist/index.d.ts`.

## Form element notes

- Prefer **`Signature2`** for new forms (role/position-aware digital signature).
- The legacy canvas **`Signature`** element still renders existing schemas but is removed from the default toolbar and emits a deprecation warning in development.

## Props

CamelCase props are preferred. Legacy snake_case aliases still work; when both are passed, camelCase wins.

### ReactFormBuilder

| Prop | Type | Description |
|------|------|-------------|
| `onPost` | `Function` | Called with form data on save |
| `url` | `string` | URL to load/save form data |
| `toolbarItems` | `Array` | Custom toolbar items |
| `showDescription` | `boolean` | Show toolbar item descriptions (`show_description`) |

### ReactFormGenerator

| Prop | Type | Description |
|------|------|-------------|
| `data` | `Array` | Form schema from the builder |
| `answerData` | `Array\|Object` | Pre-filled answers (`answer_data`) |
| `onSubmit` | `Function` | Submit handler |
| `readOnly` | `boolean` | Disable all inputs (`read_only`) |
| `hideActions` | `boolean` | Hide submit/cancel buttons (`hide_actions`) |
| `actionName` | `string` | Submit button text (`action_name`, default: "Submit") |
| `skipValidations` | `boolean` | Skip validation on submit (`skip_validations`) |
| `formAction` | `string` | Native form action URL (`form_action`) |
| `formMethod` | `string` | Native form method (`form_method`) |

## Development

```bash
yarn install
yarn dev        # Vite playground
yarn lint       # ESLint
yarn test       # Vitest
yarn build      # Production build (JS + CSS in dist/)
yarn link:local # Build + register yarn link (for parent projects)
```

For architecture, conventions, and AI agent context, see [AGENTS.md](./AGENTS.md).

## Local development in migration-vdc

To test this library inside the **migration-vdc** parent project (dev only, not publish), see [docs/LOCAL_DEV_CONSUMER.md](./docs/LOCAL_DEV_CONSUMER.md).

That guide covers:

- `file:` dependency or `yarn link`
- A dev-only label banner you add in **migration-vdc** (not in this library)
- Scripts to rebuild `dist/` before running the parent app

## Local Linking (other host projects)

Use `npm link` to consume this package locally from a host project during development.

### 1. Build and register the link

In this repo, build and register the link:

```bash
yarn link:local
```

### 2. Link into host project

In your host project's root directory:

```bash
npm link @visif/form-builder
```

### 3. Rebuild on changes

After editing source files in this repo, re-run the build to propagate changes:

```bash
npm run build
```

### 4. Unlink when done

```bash
# In host project
npm unlink @visif/form-builder

# In this repo
npm unlink
```

## Build & Publish

```bash
npm run build
npm version patch
npm publish
```

## License

MIT
