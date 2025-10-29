# Getting Started with react-form-builder2

## 📚 Documentation Overview

Welcome to react-form-builder2 v1.0.0! Here are your comprehensive guides:

1. **[README.md](./README.md)** - Main documentation and quick start
2. **[API.md](./API.md)** - Complete API reference and prop types
3. **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Upgrading from v0.10.0
4. **[CHANGELOG.md](./CHANGELOG.md)** - What's new in v1.0.0
5. **[examples/README.md](./examples/README.md)** - Working examples
6. **[CLASS_TO_HOOKS_GUIDE.md](./CLASS_TO_HOOKS_GUIDE.md)** - Hooks patterns (for contributors)

---

## 🚀 Quick Start

### For New Users

#### 1. Installation

```bash
npm install react-form-builder2 --legacy-peer-deps
# or
yarn add react-form-builder2
```

**Requirements:**
- React >= 18.0.0
- React-DOM >= 18.0.0
- Node.js >= 18.0.0

#### 2. Basic Usage - Form Builder

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ReactFormBuilder } from 'react-form-builder2';
import 'react-form-builder2/dist/app.css';

function App() {
  const handleSubmit = (data) => {
    console.log('Form saved:', data);
  };

  return (
    <ReactFormBuilder
      url="/api/forms/initial"
      saveUrl="/api/forms/save"
      onSubmit={handleSubmit}
    />
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

#### 3. Basic Usage - Form Generator

```javascript
import { ReactFormGenerator } from 'react-form-builder2';

function DisplayForm({ formData }) {
  return (
    <ReactFormGenerator
      data={formData}
      form_action="/submit"
      form_method="POST"
    />
  );
}
```

### For Users Upgrading from v0.10.0

📖 **See the [Migration Guide](./MIGRATION_GUIDE.md)** for detailed upgrade instructions.

**Key Steps:**
1. Update React to 18: `npm install react@^18 react-dom@^18`
2. Update your code to use `createRoot` instead of `ReactDOM.render`
3. Update library: `npm install react-form-builder2@^1.0.0 --legacy-peer-deps`
4. Test thoroughly

---

## 📋 What's New in v1.0.0

### ✅ Major Improvements

- **React 18** - Modern React with concurrent features
- **Vite Build System** - 5-10x faster builds (11s vs 45s)
- **38/40 Components Modernized** - Using hooks instead of classes
- **Ant Design** - Replaced Bootstrap with modern components
- **react-dnd v16** - Latest drag-and-drop with hooks API
- **Full PropTypes** - Type validation on all components
- **Modern ESLint** - React 18 + hooks rules configured

### 🎯 Bundle Sizes

- **ES Module**: 2.19 MB (gzipped: 524 KB)
- **UMD Module**: 1.55 MB (gzipped: 447 KB)

---

## 🎨 Features

### Form Builder
- Drag-and-drop interface
- 25+ form elements (inputs, dates, signatures, files, etc.)
- Custom toolbar items support
- Multi-column layouts
- Real-time preview
- Undo/redo functionality

### Form Generator
- Render forms from JSON
- Built-in validation
- Answer pre-population
- Read-only mode
- Variable replacement (signatures)
- Custom submit handlers

### Supported Elements

**Static**: Header, Paragraph, Label, LineBreak, HyperLink, Download
**Inputs**: TextInput, NumberInput, TextArea, Dropdown, Checkboxes, RadioButtons
**Date/Time**: DatePicker, TimePicker
**Advanced**: Signature, StarRating, Tags, Range, Table
**Files**: FileUpload, ImageUpload, Camera
**Special**: FormLink, DataSource, CustomElement

---

## 🔧 Development

### Running Examples

```bash
cd examples/cra
npm install --legacy-peer-deps
npm start
```

See [examples/README.md](./examples/README.md) for all available examples.

### Building from Source

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start dev server (Vite)
npm start

# Build library
npm run build

# Build styles
npm run build:style
```

---

## 📖 Next Steps

### New Users
1. ✅ Read [README.md](./README.md)
2. ✅ Check [API.md](./API.md) for prop reference
3. ✅ Try an [example](./examples/README.md)
4. ✅ Build your first form!

### Upgrading Users
1. ✅ Read [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
2. ✅ Update React to 18
3. ✅ Update your code (`createRoot`)
4. ✅ Test thoroughly

### Contributors
1. ✅ Read [MIGRATION_PROGRESS.md](./MIGRATION_PROGRESS.md)
2. ✅ Review [CLASS_TO_HOOKS_GUIDE.md](./CLASS_TO_HOOKS_GUIDE.md)
3. ✅ Check remaining work (2 components)
4. ✅ Submit PRs!

---

## 🆘 Getting Help

### Common Issues

**Issue: npm install fails**
```bash
# Use legacy-peer-deps flag
npm install --legacy-peer-deps
```

**Issue: "ReactDOM.render is no longer supported"**
```javascript
// Old (React 16)
ReactDOM.render(<App />, document.getElementById('root'));

// New (React 18)
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

**Issue: Font Awesome icons not showing**
```html
<!-- Update to FontAwesome 6 -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

### Resources
- [GitHub Issues](https://github.com/Kiho/react-form-builder/issues)
- [React 18 Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [API Documentation](./API.md)

---

## � Current Status

**Version**: 1.0.0-beta.1
**React**: 18.3.1
**Build**: Vite 5.4
**Components**: 38/40 converted to hooks (95%)
**Documentation**: Complete
**Examples**: Updated for React 18

---

**Ready to build amazing forms?** Let's go! �
