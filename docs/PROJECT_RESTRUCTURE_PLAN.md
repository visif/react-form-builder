# Project Restructure Plan

## Current Structure Analysis

The current project has files scattered in the root `src/` directory with some organization in subdirectories. This makes it harder to navigate and maintain.

### Current Structure Issues:
- ❌ Mixed component types in root (`src/toolbar.jsx`, `src/preview.jsx`)
- ❌ Unclear separation between builder and generator
- ❌ Utility files in root (`UUID.js`, `ItemTypes.js`)
- ❌ Inconsistent naming (some files have `-`, some don't)
- ✅ Good: Already has `hooks/`, `stores/`, `functions/`, `types/` directories

## Proposed Modern Structure

```
src/
├── index.jsx                      # Main library export
├── components/                    # All React components
│   ├── builder/                   # Form Builder (Design Mode)
│   │   ├── Toolbar/
│   │   │   ├── Toolbar.jsx
│   │   │   ├── ToolbarDraggableItem.jsx
│   │   │   └── index.js
│   │   ├── Preview/
│   │   │   ├── Preview.jsx
│   │   │   ├── SortableElement.jsx
│   │   │   ├── SortableFormElements.jsx
│   │   │   ├── FormPlaceHolder.jsx
│   │   │   └── index.js
│   │   ├── ElementEditor/
│   │   │   ├── FormElementsEdit.jsx
│   │   │   ├── editors/            # Sub-component editors
│   │   │   │   ├── common/         # Reusable field editors
│   │   │   │   │   ├── TextFieldEditor.jsx
│   │   │   │   │   ├── CheckboxFieldEditor.jsx
│   │   │   │   │   ├── SelectFieldEditor.jsx
│   │   │   │   │   ├── NumberFieldEditor.jsx
│   │   │   │   │   ├── WysiwygEditor.jsx
│   │   │   │   │   └── index.js
│   │   │   │   ├── specific/       # Element-specific editors
│   │   │   │   │   ├── LabelEditor.jsx
│   │   │   │   │   ├── ImageEditor.jsx
│   │   │   │   │   ├── RangeEditor.jsx
│   │   │   │   │   ├── SignatureEditor.jsx
│   │   │   │   │   ├── FormLinkEditor.jsx
│   │   │   │   │   ├── DataSourceEditor.jsx
│   │   │   │   │   └── index.js
│   │   │   │   └── index.js
│   │   │   ├── DynamicOptionList.jsx
│   │   │   ├── DynamicColumnList.jsx
│   │   │   ├── FixedRowList.jsx
│   │   │   └── index.js
│   │   └── index.js
│   ├── generator/                 # Form Generator (Runtime)
│   │   ├── ReactForm.jsx
│   │   ├── FormValidator.jsx
│   │   └── index.js
│   ├── form-elements/             # Form element components
│   │   ├── inputs/
│   │   │   ├── DatePicker.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── FormulaInput.jsx
│   │   │   └── index.js
│   │   ├── uploads/
│   │   │   ├── FileUpload.jsx
│   │   │   ├── ImageUpload.jsx
│   │   │   └── index.js
│   │   ├── display/
│   │   │   ├── HeaderBar.jsx
│   │   │   ├── Section.jsx
│   │   │   └── index.js
│   │   ├── advanced/
│   │   │   ├── Signature2.jsx
│   │   │   ├── DataSource.jsx
│   │   │   ├── FormLink.jsx
│   │   │   ├── StarRating.jsx
│   │   │   └── index.js
│   │   ├── layout/                # Multi-column layouts
│   │   │   ├── TwoColumnRow.jsx
│   │   │   ├── ThreeColumnRow.jsx
│   │   │   ├── FourColumnRow.jsx
│   │   │   ├── DynamicColumnRow.jsx
│   │   │   └── index.js
│   │   ├── shared/
│   │   │   ├── ComponentHeader.jsx
│   │   │   ├── ComponentLabel.jsx
│   │   │   ├── CustomElement.jsx
│   │   │   └── index.js
│   │   └── index.js              # Main form elements export
│   └── index.js                   # All components export
├── hooks/                         # Custom React hooks
│   ├── useFormBuilder.js
│   ├── useFormValidator.js
│   └── index.js
├── stores/                        # State management
│   ├── FormBuilderContext.jsx
│   ├── registry.js
│   ├── store.js
│   └── index.js
├── utils/                         # Utility functions
│   ├── uuid.js                    # Renamed from UUID.js
│   ├── requests.js                # Moved from stores/
│   ├── xss.js                     # Moved from form-elements/myxss.js
│   └── index.js
├── constants/                     # Constants and configurations
│   ├── itemTypes.js              # Renamed from ItemTypes.js
│   ├── toolbarConfig.js
│   └── index.js
├── types/                         # TypeScript types (existing)
│   └── index.js
├── functions/                     # Business logic (existing)
│   └── index.js
├── styles/                        # Global styles (existing)
│   └── ...
└── assets/                        # Static assets
    └── images/
        └── noImage.png           # Moved from form-elements/
```

## Migration Benefits

### 1. **Clear Separation of Concerns**
- **Builder** components are isolated from **Generator** components
- **Form Elements** are categorized by type (inputs, uploads, display, advanced, layout)
- **Utilities** and **Constants** are clearly separated

### 2. **Better Discoverability**
- New developers can quickly find what they need
- Logical grouping makes navigation intuitive
- Similar components are co-located

### 3. **Scalability**
- Easy to add new form elements in appropriate categories
- New utilities/hooks/stores have clear homes
- Component composition is encouraged

### 4. **Maintainability**
- Related code is grouped together
- Index files provide clear export points
- Easier to write tests for isolated modules

### 5. **Modern Best Practices**
- Follows React community conventions
- Supports tree-shaking (via index.js exports)
- Clear public API surface (main index.jsx)

## Migration Strategy

### Phase 1: Create New Directory Structure
1. Create all new directories
2. Keep old files in place (no breaking changes yet)

### Phase 2: Move Components (Builder)
1. Move toolbar components → `components/builder/Toolbar/`
2. Move preview components → `components/builder/Preview/`
3. Move editor components → `components/builder/ElementEditor/`
4. Create index.js files for each subdirectory

### Phase 3: Move Components (Generator)
1. Move form.jsx → `components/generator/ReactForm.jsx`
2. Move form-validator.jsx → `components/generator/FormValidator.jsx`

### Phase 4: Organize Form Elements
1. Categorize form elements by type
2. Move to appropriate subdirectories
3. Update imports in index.js files

### Phase 5: Move Utilities & Constants
1. Rename and move UUID.js → `utils/uuid.js`
2. Rename and move ItemTypes.js → `constants/itemTypes.js`
3. Move requests.js from stores/ → `utils/`
4. Move myxss.js → `utils/xss.js`
5. Move noImage.png → `assets/images/`

### Phase 6: Update All Imports
1. Update relative imports in all files
2. Use index.js barrel exports where possible
3. Test thoroughly after each batch of updates

### Phase 7: Update Main Index
1. Update src/index.jsx to export from new locations
2. Ensure backward compatibility for existing users

### Phase 8: Cleanup
1. Remove old empty directories
2. Update documentation
3. Commit with descriptive messages

## File Mapping Reference

### Components → Builder
```
src/toolbar.jsx                           → components/builder/Toolbar/Toolbar.jsx
src/toolbar-draggable-item.jsx            → components/builder/Toolbar/ToolbarDraggableItem.jsx
src/preview.jsx                           → components/builder/Preview/Preview.jsx
src/sortable-element.jsx                  → components/builder/Preview/SortableElement.jsx
src/sortable-form-elements.jsx            → components/builder/Preview/SortableFormElements.jsx
src/form-place-holder.jsx                 → components/builder/Preview/FormPlaceHolder.jsx
src/form-elements-edit.jsx                → components/builder/ElementEditor/FormElementsEdit.jsx
src/form-elements-edit/*                  → components/builder/ElementEditor/editors/
src/dynamic-option-list.jsx               → components/builder/ElementEditor/DynamicOptionList.jsx
src/dynamic-column-list.jsx               → components/builder/ElementEditor/DynamicColumnList.jsx
src/fixed-row-list.jsx                    → components/builder/ElementEditor/FixedRowList.jsx
```

### Components → Generator
```
src/form.jsx                              → components/generator/ReactForm.jsx
src/form-validator.jsx                    → components/generator/FormValidator.jsx
```

### Form Elements Reorganization
```
src/form-elements/date-picker.jsx         → components/form-elements/inputs/DatePicker.jsx
src/form-elements/table.jsx               → components/form-elements/inputs/Table.jsx
src/form-elements/formula-input.jsx       → components/form-elements/inputs/FormulaInput.jsx
src/form-elements/fileUpload2.jsx         → components/form-elements/uploads/FileUpload.jsx
src/form-elements/imageUpload.jsx         → components/form-elements/uploads/ImageUpload.jsx
src/form-elements/header-bar.jsx          → components/form-elements/display/HeaderBar.jsx
src/form-elements/section.jsx             → components/form-elements/display/Section.jsx
src/form-elements/signature2.jsx          → components/form-elements/advanced/Signature2.jsx
src/form-elements/datasource.jsx          → components/form-elements/advanced/DataSource.jsx
src/form-elements/form-link.jsx           → components/form-elements/advanced/FormLink.jsx
src/form-elements/star-rating.jsx         → components/form-elements/advanced/StarRating.jsx
src/multi-column/*                        → components/form-elements/layout/
src/form-elements/component-header.jsx    → components/form-elements/shared/ComponentHeader.jsx
src/form-elements/component-label.jsx     → components/form-elements/shared/ComponentLabel.jsx
src/form-elements/custom-element.jsx      → components/form-elements/shared/CustomElement.jsx
```

### Utilities & Constants
```
src/UUID.js                               → utils/uuid.js
src/ItemTypes.js                          → constants/itemTypes.js
src/stores/requests.js                    → utils/requests.js
src/form-elements/myxss.js                → utils/xss.js
src/form-elements/noImage.png             → assets/images/noImage.png
```

## Import Path Examples

### Before:
```javascript
import Toolbar from './toolbar'
import Preview from './preview'
import FormElementsEdit from './form-elements-edit'
import ID from './UUID'
import ItemTypes from './ItemTypes'
```

### After:
```javascript
import { Toolbar } from './components/builder/Toolbar'
import { Preview } from './components/builder/Preview'
import { FormElementsEdit } from './components/builder/ElementEditor'
import { uuid } from './utils'
import { ITEM_TYPES } from './constants'
```

## Testing Strategy

1. **Move files incrementally** - don't move everything at once
2. **Test after each major move** - ensure dev server compiles
3. **Use git** - commit after each successful phase
4. **Verify imports** - use grep to find all import references
5. **Check bundle size** - ensure no duplicates are included

## Rollback Plan

Each phase is committed separately, so we can:
1. Identify which commit caused issues
2. `git revert` specific commits
3. Fix issues and retry

## Success Criteria

- ✅ All files in appropriate directories
- ✅ Clear separation between builder and generator
- ✅ Logical categorization of form elements
- ✅ No broken imports
- ✅ Dev server runs without errors
- ✅ Build succeeds
- ✅ All tests pass (if any)
- ✅ Documentation updated

## Timeline Estimate

- Phase 1-2: 30 minutes (directory creation + builder components)
- Phase 3-4: 45 minutes (generator + form elements)
- Phase 5: 20 minutes (utilities & constants)
- Phase 6: 1-2 hours (update all imports - most time consuming)
- Phase 7-8: 30 minutes (main index + cleanup)

**Total: ~3-4 hours** (with testing and careful verification)

## Next Steps

1. Review and approve this plan
2. Start with Phase 1 (create directories)
3. Execute phases incrementally
4. Test thoroughly after each phase
5. Commit with descriptive messages

---

**Note**: This restructure is a significant refactoring. We should:
- Do this in a separate commit/branch if needed
- Ensure all tests pass before and after
- Update any documentation that references file paths
- Consider updating package.json "main" and "exports" fields
