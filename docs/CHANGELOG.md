# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Deprecated
- Canvas `Signature` toolbar item is removed from the default toolbar. Prefer `Signature2` for new forms. Existing schemas that use `Signature` continue to render; a development-only warning is emitted.

## [1.0.0] - 2025-10-30

### 🎉 Major Modernization Release

This is a complete modernization of react-form-builder2, bringing it up to date with React 18 and modern build tools.

**Migration Status: 95% Complete (38/40 components converted to hooks)**

### Added

#### Build & Tooling
- ✅ **Vite 5.4** build system (replaces Webpack)
  - Lightning-fast dev server (~2s startup vs ~15s with Webpack)
  - Production builds in ~11s (was ~45s)
  - ES module and UMD bundles
  - Source maps included

- ✅ **Modern ESLint** configuration
  - Updated to `@babel/eslint-parser`
  - Added `eslint-plugin-react-hooks` for hooks validation
  - React 18 specific rules configured
  - 0 errors in codebase

- ✅ **PropTypes validation** on all major components
  - ReactFormBuilder (23 props validated)
  - Toolbar (items, customItems, showDescription)
  - Table (data, defaultValue, read_only, editor)
  - FormValidator (emitter)
  - HeaderBar (data, editModeOn, callbacks)
  - StarRating (all props validated)

#### Documentation
- ✅ **Comprehensive migration documentation**
  - MIGRATION_PLAN.md (18-phase plan)
  - MIGRATION_CHECKLIST.md (quick reference)
  - CLASS_TO_HOOKS_GUIDE.md (conversion patterns)
  - MIGRATION_PROGRESS.md (progress tracking)
  - MIGRATION_GUIDE.md (user upgrade guide)
  - CHANGELOG.md (this file)

### Changed

#### State Management
- ✅ **Replaced Beedle with React Context + useReducer**
  - Removed deprecated `beedle` dependency (no longer maintained)
  - Created modern `FormBuilderContext.jsx` with React Context and useReducer
  - Maintained backward compatibility with singleton API
  - Fixed store subscription to properly return unsubscribe functions
  - Prevented memory leaks with proper cleanup
  - Exported `FormBuilderProvider` and `useFormBuilderStore` for modern usage
  - Fixed toolbar state merging to preserve items
  - Added global polyfill for draft-js browser compatibility

#### React Upgrade
- ✅ **React 16.14.0 → 18.3.1**
  - Updated to `createRoot` API
  - All components compatible with React 18
  - Concurrent features ready

#### Components - Converted to Hooks (38/40)
- ✅ **Utility Components (5/5)**
  - DynamicOptionList: class → functional with useState/useCallback
  - DynamicColumnList: class → functional with useState/useCallback
  - PlaceHolder: class → functional
  - ToolbarItem: DragSource HOC → useDrag hook
  - FixedRowList: class → functional with complex state management

- ✅ **Basic Form Elements (10/10)**
  - Header, Paragraph, Label, LineBreak: simple functional conversions
  - TextInput, NumberInput, TextArea: useState + useCallback patterns
  - Dropdown: useState + useEffect for prop sync
  - Checkboxes, RadioButtons: useRef + useState + useCallback

- ✅ **Complex Form Elements (7/7)**
  - Signature: useState + useRef for canvas + SignaturePad
  - Tags: useState + useRef for react-select integration
  - Rating: useRef for StarRating component
  - HyperLink, Download: simple functional components
  - Camera: useState + useCallback for FileReader logic
  - Range: useState + useCallback with Ant Design Slider

- ✅ **Specialized Components (6/6)**
  - FormLink: useState + useEffect for async form loading
  - DataSource: useState + useRef for sync loop prevention
  - Signature2: useState + useCallback for role-based permissions
  - DatePicker: useState + useRef + useEffect for Buddhist calendar
  - ImageUpload: useState + useCallback for blob URLs
  - FileUpload: useState + useCallback for multiple files

- ✅ **Main Application Components (7/9)**
  - ReactFormBuilder: useState + useCallback with DndProvider
  - Toolbar: useState + useEffect for store subscription (587 lines)
  - Section: simple functional component
  - StarRating: useState + useRef for complex interactions
  - HeaderBar: functional with conditional rendering
  - Table: useState + useEffect for dynamic table (264 lines)
  - FormValidator: useState + useEffect for EventEmitter (78 lines)

- ⏸️ **Deferred (2/40 components)**
  - ReactForm (form.jsx) - 972 lines - complex EventEmitter integration
  - FormElementsEdit (form-elements-edit.jsx) - 1079 lines - Draft.js integration
  - *Note: These components still work but will be converted in a future release*

#### Dependencies
- ✅ **Upgraded Major Dependencies**
  - react-dnd: 11.1.3 → 16.0.1 (all HOCs → hooks)
  - react-dnd-html5-backend: 11.1.3 → 16.0.1
  - react-datepicker: 3.4.1 → 7.5.0
  - react-select: 3.2.0 → 5.8.3
  - @vitejs/plugin-react: ^4.3.4 (new)
  - vite: ^5.4.21 (new)
  - vite-plugin-css-injected-by-js: ^3.5.2 (new)

- ✅ **Security Updates**
  - axios: 0.21.1 → 1.7.9 (CRITICAL security fix)

- ✅ **Module System**
  - Registry.js: CommonJS → ES6 module
  - UUID.js: CommonJS → ES6 module, var → const

### Removed

#### Bootstrap Dependencies
- ❌ **Removed react-bootstrap-slider**
  - Replaced with Ant Design Slider
  - Better React 18 compatibility
  - More modern API

- ❌ **Removed Bootstrap SCSS imports**
  - application.scss cleaned up
  - Smaller bundle size

#### Deprecated React APIs
- ❌ **Removed findDOMNode usage**
  - Replaced with useRef + getBoundingClientRect()
  - React 18 StrictMode compatible

- ❌ **Removed HOC patterns** (where applicable)
  - DragSource/DropTarget → useDrag/useDrop hooks
  - Better tree-shaking
  - Easier to understand

### Fixed

#### Build Issues
- ✅ Fixed Vite configuration for JSX in .js files
  - Added esbuild loader for .js files
  - app.js and demobar.js now parse correctly

- ✅ Fixed npm install issues
  - Changed `prepublish` → `prepublishOnly`
  - Removed unused Babel plugins
  - Added `--legacy-peer-deps` documentation

#### Component Issues
- ✅ Fixed duplicate keys in preview.jsx
- ✅ Fixed Slider component onChange handler for Ant Design
- ✅ Fixed react-dnd v16 compatibility
  - Grip.jsx: DragSource → useDrag
  - Dustbin.jsx: DropTarget → useDrop
  - sortable-element.jsx: Both HOCs → combined hooks

### Migration Path

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed upgrade instructions.

**Quick Start:**
1. Update React to 18: `npm install react@^18 react-dom@^18`
2. Update code to use `createRoot` API
3. Update library: `npm install react-form-builder2@^1.0.0 --legacy-peer-deps`
4. Test thoroughly

### Breaking Changes

⚠️ **User Impact:**
1. **React 18 required** - Must update React and use `createRoot` API
2. **Node.js 18+ required** - Older versions not supported
3. **Bootstrap removed** - Now uses Ant Design internally
4. **react-dnd v16** - Custom toolbar items may need updates

⚠️ **Developer Impact:**
1. **Vite build system** - New dev server and build commands
2. **Hooks everywhere** - 38/40 components now functional
3. **ES6 modules** - All imports/exports modernized

### Build Metrics

**Production Build:**
- ES module: 2,186.67 kB (gzip: 523.79 kB)
- UMD module: 1,548.58 kB (gzip: 447.40 kB)
- Build time: ~11.43s
- Modules transformed: 3,606

**Bundle Size:**
- Gzipped ES: ~524 KB
- Gzipped UMD: ~447 KB

### Testing

- ✅ Dev server: http://localhost:8080/ (working)
- ✅ Production build: Successful
- ✅ ESLint: 0 errors, 51 style warnings
- ✅ All 38 converted components compile successfully

### Known Issues

1. **react-image-lightbox temporarily disabled**
   - Not compatible with React 18
   - Will be replaced with modern alternative in future release

2. **2 components still using class patterns**
   - ReactForm (972 lines)
   - FormElementsEdit (1079 lines)
   - Both work correctly but will be converted in future release

3. **CJS Vite API deprecation warning**
   - Non-critical warning during build
   - Will be addressed when dependencies update

### Repository Cleanup

- ❌ **Removed 152+ files** from repository
  - Webpack and legacy build system (47 files, 2,874 lines)
  - Outdated examples (64 files, 22,099 lines)
  - Demo server and public folders (39 files, 21,994 lines)
  - Old documentation build artifacts

- ✨ **Removed 536 packages** from dependencies
  - 479 packages from webpack ecosystem
  - 55 packages from demo server (express, multer)
  - 2 outdated Babel plugins

- 📁 **Reorganized documentation**
  - All .md files moved to `docs/` folder
  - Cleaner repository structure
  - Better navigation

- **Total cleanup: ~61,391 lines deleted**

### Contributors

Thanks to all contributors who helped with this major modernization!

---

## [0.10.0] - 2024-XX-XX

Previous version using React 16, Webpack, and Bootstrap.

See git history for previous changes.

---

**Legend:**
- ✅ Completed
- ⏸️ Deferred
- ❌ Removed
- ⚠️ Breaking Change
