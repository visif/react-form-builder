# React Form Builder Examples

This directory contains various examples demonstrating how to use react-form-builder2 v1.0.0+ with React 18.

## 📁 Available Examples

### 1. **CRA (Create React App)** - `./cra/`
**Recommended for beginners**

A complete Create React App example showing form builder and generator integration.

- ✅ React 18 with `createRoot` API
- ✅ Full form builder with toolbar
- ✅ Form generator with validation
- ✅ Demo bar with state management

**Run:**
```bash
cd cra
npm install --legacy-peer-deps
npm start
```

**Learn More:** [CRA README](./cra/README.md)

---

### 2. **Demo** - `./demo/`
Basic demonstration with minimal setup.

- Simple HTML + bundled JS
- Good for understanding core concepts
- Updated for React 18 and Font Awesome 6

**Run:**
```bash
cd demo
npm install --legacy-peer-deps
npm start
```

---

### 3. **Custom** - `./custom/`
Custom implementation with JSON API integration.

- Shows custom toolbar items
- Form data persistence
- API integration examples

**Run:**
```bash
cd custom
npm install --legacy-peer-deps
npm start
```

---

### 4. **Next.js** - `./next/`
Server-side rendering with Next.js.

- Next.js integration
- SSR-compatible form builder
- MongoDB integration available (`./mongo/`)

**Run:**
```bash
cd next
npm install --legacy-peer-deps
npm run dev
```

**Mongo variant:**
```bash
cd mongo
npm install --legacy-peer-deps
npm run dev
```

---

### 5. **UMD** - `./umd/`
Standalone UMD build usage (no bundler required).

- Use in plain HTML
- CDN-friendly
- No build step needed

**Run:**
```bash
cd umd
# Just open index.html in browser
open index.html
```

---

### 6. **Local Test** - `./local-test/`
Development testing environment.

- Quick testing setup
- Development experiments

---

## 🚀 Quick Start

### Prerequisites

All examples require:
- **Node.js** >= 18.0.0
- **React** >= 18.0.0
- **npm** or **yarn**

### Installation

Most examples use `--legacy-peer-deps` due to peer dependency transitions:

```bash
cd <example-directory>
npm install --legacy-peer-deps
npm start
```

### React 18 Migration

All examples have been updated to use React 18's `createRoot` API:

**Before (React 16):**
```javascript
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));
```

**After (React 18):**
```javascript
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

## 📚 Common Patterns

### Basic Form Builder

```javascript
import React from 'react';
import { ReactFormBuilder } from 'react-form-builder2';
import 'react-form-builder2/dist/app.css';

function App() {
  return (
    <ReactFormBuilder
      url="/api/forms/initial.json"
      saveUrl="/api/forms/save"
    />
  );
}
```

### Form Generator

```javascript
import React from 'react';
import { ReactFormGenerator } from 'react-form-builder2';
import 'react-form-builder2/dist/app.css';

function DisplayForm({ formData }) {
  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <ReactFormGenerator
      data={formData}
      onSubmit={handleSubmit}
      form_action="/submit"
      form_method="POST"
    />
  );
}
```

### Custom Toolbar Items

```javascript
const customItems = [
  {
    key: 'CustomElement',
    name: 'My Custom Element',
    icon: 'fa fa-custom',
    static: false,
    content: 'Custom content',
    // ... other properties
  }
];

<ReactFormBuilder
  customToolbarItems={customItems}
  // ... other props
/>
```

## 🔧 Troubleshooting

### npm install fails
```bash
# Use legacy-peer-deps flag
npm install --legacy-peer-deps
```

### React 18 warnings
Ensure you're using `createRoot` instead of `ReactDOM.render`.

### Font Awesome icons not showing
Update to Font Awesome 6:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

### Bootstrap removed
Bootstrap has been replaced with Ant Design in v1.0.0. Remove Bootstrap imports if present.

## 📖 Documentation

- [Main README](../README.md)
- [Migration Guide](../docs/MIGRATION_GUIDE.md)
- [Changelog](../docs/CHANGELOG.md)
- [API Documentation](../docs/API.md)

## 🤝 Contributing

Found an issue with an example? Please [open an issue](https://github.com/Kiho/react-form-builder/issues).

Want to add a new example? PRs welcome!

## 📄 License

MIT - Same as the main project
