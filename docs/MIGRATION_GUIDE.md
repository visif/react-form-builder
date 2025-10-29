# Migration Guide: v0.10.0 → v1.0.0

This guide helps you upgrade from react-form-builder2 v0.10.0 to v1.0.0, which includes a major modernization to React 18 and Vite.

## Breaking Changes

### 1. React 18 Required

**Before (v0.10.0):**
```javascript
import ReactDOM from 'react-dom';

ReactDOM.render(
  <ReactFormBuilder />,
  document.getElementById('root')
);
```

**After (v1.0.0+):**
```javascript
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<ReactFormBuilder />);
```

### 2. Node.js and React Version Requirements

- **Node.js**: >= 18.0.0 (was: >= 8.0.0)
- **React**: >= 18.0.0 (was: >= 16.8.0)
- **React-DOM**: >= 18.0.0

### 3. Bootstrap Removed → Ant Design

Bootstrap components have been replaced with Ant Design:

**Removed:**
- `react-bootstrap-slider`

**Replaced with:**
- Ant Design `Slider` component
- Ant Design `DatePicker` component
- Ant Design `TimePicker` component

**What You Need to Do:**
- Remove Bootstrap CSS imports if you were using them
- The form builder now uses Ant Design internally
- No action required unless you customized Bootstrap styles

### 4. Build Tool: Webpack → Vite

The library is now built with Vite instead of Webpack:

**Old scripts:**
```json
"build": "webpack --config webpack.production.config.js"
```

**New scripts:**
```json
"build": "vite build",
"start": "vite",
"legacy:build": "webpack --config webpack.production.config.js"
```

**For library consumers:** No changes needed - the distributed files remain compatible.

**For contributors:** Use `npm start` for Vite dev server (much faster than webpack-dev-server).

### 5. react-dnd Updated (v11 → v16)

The drag-and-drop library was updated to react-dnd v16:

- All internal components now use modern hooks API (`useDrag`, `useDrop`)
- No breaking changes for library users
- If you created custom toolbar items, ensure they use hooks API

### 6. Deprecated APIs Removed

The following deprecated React APIs have been removed:
- `findDOMNode` - replaced with refs
- `componentWillMount` - replaced with `useEffect`
- `componentWillReceiveProps` - replaced with `useEffect` + dependency arrays

## New Features

### ✅ All Components Use Hooks
- 38/40 components converted to functional components
- Better performance and smaller bundle size
- Easier to understand and maintain

### ✅ PropTypes Validation
All major components now have comprehensive PropTypes for better type safety.

### ✅ ESLint Configuration
Modern ESLint setup with React 18 + hooks rules:
- `react-hooks/rules-of-hooks` (error)
- `react-hooks/exhaustive-deps` (warning)

### ✅ Faster Builds
Vite builds are significantly faster than Webpack:
- Dev server: ~2s startup (was ~15s)
- Production build: ~11s (was ~45s)

## Installation

### Update package.json

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-form-builder2": "^1.0.0"
  }
}
```

### Install with legacy peer deps

Due to some peer dependency conflicts during the transition:

```bash
npm install --legacy-peer-deps
# or
yarn install
```

## Step-by-Step Migration

### Step 1: Update React to 18

```bash
npm install react@^18.3.1 react-dom@^18.3.1 --legacy-peer-deps
```

### Step 2: Update Your Code to Use createRoot

Find all instances of `ReactDOM.render()` and replace:

**Before:**
```javascript
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));
```

**After:**
```javascript
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### Step 3: Update react-form-builder2

```bash
npm install react-form-builder2@^1.0.0 --legacy-peer-deps
```

### Step 4: Test Your Application

1. **Check console for warnings:**
   - React 18 may show new warnings about deprecated patterns
   - Address any `findDOMNode` warnings in your own code

2. **Test drag-and-drop:**
   - Verify form builder drag-and-drop still works
   - Test custom toolbar items if you have any

3. **Test form generation:**
   - Verify forms render correctly
   - Test form submission
   - Verify validation still works

### Step 5: Remove Bootstrap (if applicable)

If you were importing Bootstrap for the form builder:

**Before:**
```html
<link rel="stylesheet" href="bootstrap.min.css">
```

**After:**
```html
<!-- Only need FontAwesome now -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

## Troubleshooting

### Issue: npm install fails with peer dependency errors

**Solution:** Use `--legacy-peer-deps` flag:
```bash
npm install --legacy-peer-deps
```

### Issue: "ReactDOM.render is no longer supported"

**Solution:** Update to React 18's `createRoot` API (see Step 2 above).

### Issue: Slider component not working

**Cause:** Bootstrap slider was replaced with Ant Design.

**Solution:** The library handles this internally. If you were using the slider component directly, update your code to use Ant Design's Slider.

### Issue: Build warnings about CommonJS modules

**Cause:** Some dependencies still use CommonJS.

**Solution:** These warnings are harmless. The Vite build handles them correctly.

### Issue: Custom toolbar items not dragging

**Cause:** react-dnd v16 uses hooks instead of HOCs.

**Solution:** Update your custom items to use `useDrag` hook:

**Before (v11):**
```javascript
import { DragSource } from 'react-dnd';

class CustomItem extends React.Component { /* ... */ }

export default DragSource('item', spec, collect)(CustomItem);
```

**After (v16):**
```javascript
import { useDrag } from 'react-dnd';

function CustomItem(props) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'item',
    item: { /* ... */ },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
    {/* ... */}
  </div>;
}
```

## What's Next?

The following components will be converted in future releases:
- **ReactForm** (form.jsx) - 972 lines
- **FormElementsEdit** (form-elements-edit.jsx) - 1079 lines

These components still work but use class-based patterns. They will be converted to hooks in a future minor version.

## Need Help?

- [GitHub Issues](https://github.com/Kiho/react-form-builder/issues)
- [Migration Progress](./MIGRATION_PROGRESS.md)
- [Full Changelog](./CHANGELOG.md)

## Rollback Plan

If you need to rollback to v0.10.0:

```bash
npm install react-form-builder2@0.10.0
npm install react@^16.14.0 react-dom@^16.14.0
```

Then revert your code changes to use `ReactDOM.render()` instead of `createRoot()`.
