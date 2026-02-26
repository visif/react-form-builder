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

## Props

### ReactFormBuilder

| Prop | Type | Description |
|------|------|-------------|
| `onPost` | `Function` | Called with form data on save |
| `url` | `string` | URL to load/save form data |
| `toolbarItems` | `Array` | Custom toolbar items |

### ReactFormGenerator

| Prop | Type | Description |
|------|------|-------------|
| `data` | `Array` | Form schema from the builder |
| `answer_data` | `Array` | Pre-filled answers |
| `onSubmit` | `Function` | Submit handler |
| `read_only` | `boolean` | Disable all inputs |
| `hide_actions` | `boolean` | Hide submit/cancel buttons |
| `action_name` | `string` | Submit button text (default: "Submit") |
| `skip_validations` | `boolean` | Skip validation on submit |

## Development

```bash
npm install
npm run dev
```

## Local Linking (use in another project without publishing)

Use `npm link` to consume this package locally from a host project during development.

### 1. Build and register the link

In this repo, build the library and register it as a global symlink:

```bash
npm run build:lib
npm link
```

### 2. Link into host project

In your host project's root directory:

```bash
npm link @visif/form-builder
```

### 3. Rebuild on changes

After editing source files in this repo, re-run the build to propagate changes:

```bash
npm run build:lib
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
npm run build:lib
npm version patch
npm publish
```

## License

MIT
