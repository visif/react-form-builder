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

## Build & Publish

```bash
npm run build:lib
npm version patch
npm publish
```

## License

MIT
