[![npm version](https://badge.fury.io/js/react-form-builder2.svg)](//npmjs.com/package/react-form-builder2)
[![downloads](https://img.shields.io/npm/dm/react-form-builder2.svg)](https://img.shields.io/npm/dm/react-form-builder2.svg)
# React Form Builder 2
A complete react form builder that interfaces with a json endpoint to load and save generated forms.

## Modern Stack (v1.0.0+)
- **React 18.3.1** with modern hooks API
- **Vite 5.4** for lightning-fast builds
- **react-dnd 16.0** for Drag & Drop
- **Ant Design** components (replaced Bootstrap)
- **Font-Awesome 6.x**
- All components converted to functional components with hooks
- Full TypeScript PropTypes validation
- ES6+ modules throughout

## Features
- 🎨 Drag & Drop form builder interface
- 💾 Save form data with JSON API
- 📋 Display submitted data in read-only mode
- 📱 Multi-column layouts
- ✅ Built-in form validation
- 🔐 Signature support with variable replacement
- 📝 Rich text editing with Draft.js

[DEMO](https://kiho.github.io/react-form-builder/) Slow Loading.... back-end is running at FREE Heroku.

## 🚀 Upgrading from v0.10.0?

**react-form-builder2 v1.0.0** is a major modernization release with React 18, Vite, and modern hooks!

📖 **See the [Migration Guide](./docs/MIGRATION_GUIDE.md)** for step-by-step upgrade instructions.

📋 **Key Changes:**
- React 18.3.1 (use `createRoot` API)
- Vite replaces Webpack (much faster!)
- Ant Design replaces Bootstrap
- 38/40 components converted to hooks
- Node.js 18+ required

![](screenshot.png)

### Editing Items
![](screenshot2.png)

# Installation

```bash
npm install react-form-builder2 --legacy-peer-deps
# or
yarn add react-form-builder2
```

**Requirements:**
- React >= 18.0.0
- React-DOM >= 18.0.0
- Node.js >= 18.0.0

# Basic Usage

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ReactFormBuilder } from 'react-form-builder2';
import 'react-form-builder2/dist/app.css';

// React 18+ usage
const root = createRoot(document.getElementById('root'));
root.render(<ReactFormBuilder />);
```

# Props

```javascript
var items = [{
  key: 'Header',
  name: 'Header Text',
  icon: 'fa fa-header',
  static: true,
  content: 'Placeholder Text...'
},
{
  key: 'Paragraph',
  name: 'Paragraph',
  static: true,
  icon: 'fa fa-paragraph',
  content: 'Placeholder Text...'
}];

<ReactFormBuilder
  url='path/to/GET/initial.json'
  toolbarItems={items}
  saveUrl='path/to/POST/built/form.json' />
```

# React Form Generator
Now that a form is built and saved, let's generate it from the saved json.

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ReactFormGenerator } from 'react-form-builder2';
import 'react-form-builder2/dist/app.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <ReactFormGenerator
    form_action="/path/to/form/submit"
    form_method="POST"
    task_id={12} // Used to submit a hidden variable with the id to the form from the database.
    answer_data={JSON_ANSWERS} // Answer data, only used if loading a pre-existing form with values.
    authenticity_token={AUTH_TOKEN} // If using Rails and need an auth token to submit form.
    data={JSON_QUESTION_DATA} // Question data
  />
);
```

### Form Params

Name | Type | Required? | Description
--- | --- | --- | ---
form_action | string | Required | URL path to submit the form
form_method | string | Required | Verb used in the form submission.
action_name | string | Optional | Defines form submit button text.  Defaults to "Submit"
onSubmit | function | optional | Invoke when submit data, if exists will override form post.
data | array | Required | Question data retrieved from the database
back_action | string | Optional | URL path to go back if needed.
back_name | string | Optional | Button text for back action.  Defaults to "Cancel".
task_id | integer | Optional | User to submit a hidden variable with id to the form on the backend database.
answer_data | array | Optional | Answer data, only used if loading a pre-existing form with values.
authenticity_token | string | Optional | If using Rails and need an auth token to submit form.
hide_actions | boolean | Optional | If you would like to hide the submit / cancel buttons set to true.
skip_validations | boolean | Optional | Suppress form validations on submit, if set to true.
display_short | boolean | Optional | Display an optional "shorter page/form" which is common for legal documents or situations where the user will just have to sign or fill out a shorter form with only the critical elements.
read_only | boolean | Optional | Shows a read only version which has fields disabled and removes "required" labels.
variables | object | Optional | Key/value object that can be used for Signature variable replacement.

### Read only Signatures

Read only signatures allow you to use a saved/canned signature to be placed into the form. The signature will be passed in through the `variables` property to `ReactFormGenerator` and `ReactFormBuilder`.

To use a read only signature, choose the "Read only" option and enter the key value of the variable that will be used to pass in the signature.

![](screenshot3.png)

The signature data should be in base 64 format.

There is a `variables.js` file that contains a sample base 64 signature. This variable is passed into the demo builder and generator for testing. Use the variable key "JOHN" to test the variable replacement.

# Vendor Dependencies
In order to make the form builder look pretty, there are a few dependencies other than React. The main stylesheet and FontAwesome must be included:

```html
<!-- Include in your HTML -->
<link rel="stylesheet" href="react-form-builder2/dist/app.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

**Note:** Bootstrap has been replaced with Ant Design components in v1.0.0+. The form builder now uses:
- **Ant Design** - For UI components (Slider, DatePicker, TimePicker)
- **FontAwesome 6.x** - For icons

# SASS
All relevant styles located in `scss/application.scss`. To customize:

```bash
# Build custom styles
npm run build:dist
```

# Development

## Setup
```bash
# Install dependencies
npm install --legacy-peer-deps
# or
yarn install
```

## Running Dev Server (Vite)
```bash
# Start Vite dev server
npm start
# or
yarn start
```
Navigate to http://localhost:8080/ to see the form builder in action.

## Building for Production
```bash
# Build library bundles (ES + UMD)
npm run build
# or
yarn build
```

Build output:
- `dist/app.es.js` - ES module (2.2 MB, gzipped: ~524 KB)
- `dist/app.umd.js` - UMD module (1.5 MB, gzipped: ~447 KB)
- `dist/app.css` - Compiled styles

## Running API Server (for testing)
```bash
# In a separate terminal
npm run serve:api
# or
yarn serve:api
```

## Legacy Webpack Build
```bash
# If you need the old webpack build
npm run legacy:build
npm run legacy:start
```

# Customizations

## Custom Form Elements

To create custom form elements, define a component and add it to the toolbar:

```jsx
import React from 'react';

const CustomRating = React.forwardRef(({ name, defaultValue, onChange }, ref) => {
  const [rating, setRating] = React.useState(defaultValue || 0);

  return (
    <div ref={ref}>
      {/* Your custom component */}
      <input type="hidden" name={name} value={rating} />
    </div>
  );
});

const customItems = [{
  key: 'CustomRating',
  name: 'Star Rating',
  icon: 'fa fa-star',
  element: 'CustomRating',
  type: 'custom',
  component: CustomRating,
  forwardRef: true
}];

<ReactFormBuilder customToolbarItems={customItems} />
```

See [API.md](./docs/API.md#custom-components) for complete documentation.

## Custom Edit Form

- to customize the field edit form copy "src/form-elements-edit.jsx" to your project and pass it to the ReactFormBuilder as a prop. Here is an example
```jsx
<ReactFormBuilder
    edit
    data={form}
    //toolbarItems={items}
    customToolbarItems={items}
    onChange={handleUpdate}
    onSubmit={handleSubmit}

    renderEditForm={props => <FormElementsEdit {...props}/>}
/>
```

## Custom Submit Button

- to customize the ReactFormGenerator submit button use it like this

```jsx
<ReactFormGenerator
    data={form}
    toolbarItems={items}
    onChange={handleUpdate}
    onSubmit={handleSubmit}
    actionName={"Set this to change the default submit button text"}
    submitButton={<button type={"submit"} className={"btn btn-primary"}>Submit</button>}
/>
```

# Tests
```bash
$ npm test
```
Test is not working at this moment.

---

## 📚 Documentation

- **[API Documentation](./docs/API.md)** - Complete API reference and prop types
- **[Migration Guide](./docs/MIGRATION_GUIDE.md)** - Upgrade from v0.10.0 to v1.0.0
- **[Changelog](./docs/CHANGELOG.md)** - Detailed release notes
- **[Getting Started](./docs/GETTING_STARTED.md)** - Quick start guide

### For Contributors
- **[Migration Progress](./docs/MIGRATION_PROGRESS.md)** - Track conversion progress
- **[Class to Hooks Guide](./docs/CLASS_TO_HOOKS_GUIDE.md)** - Conversion patterns used
- **[Migration Plan](./docs/MIGRATION_PLAN.md)** - Complete migration strategy

## 🤝 Contributing

We welcome contributions! The codebase has been modernized to React 18 and hooks.

**Current Status:**
- ✅ 38/40 components converted to functional components
- ✅ Full PropTypes validation
- ✅ Modern ESLint configuration
- ⏸️ 2 complex components deferred (ReactForm, FormElementsEdit)

See [MIGRATION_PROGRESS.md](./MIGRATION_PROGRESS.md) for details.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Original project by [Kiho](https://github.com/Kiho)
- Modernization effort: React 18, Vite, Hooks migration
- Community contributors and issue reporters

