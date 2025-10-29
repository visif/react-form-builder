# Migration Checklist - Quick Reference

## ✅ Completed | 🔄 In Progress | ⏸️ Not Started

---

## Phase 1: Setup & Dependencies Audit ⏸️
- [ ] Run `npm audit` and document vulnerabilities
- [ ] List all class components (grep search results show ~30+ components)
- [ ] List all Bootstrap dependencies to remove
- [ ] Document current test coverage
- [ ] Create backup/tag of current version

---

## Phase 2: Git Branch & Backup ⏸️
- [ ] Create branch: `git checkout -b feat/modernization`
- [ ] Tag current: `git tag v0.10.0-pre-migration`
- [ ] Push tag: `git push origin v0.10.0-pre-migration`

---

## Phase 3: Webpack → Vite ⏸️
- [ ] Install Vite dependencies
- [ ] Create `vite.config.js`
- [ ] Update package.json scripts
- [ ] Test build output
- [ ] Test dev server
- [ ] **TEST & COMMIT**

---

## Phase 4: Update React & Core ⏸️
- [ ] Update React to 18.3.x
- [ ] Update react-dom
- [ ] Update react-dnd to v16+
- [ ] Fix breaking changes (createRoot)
- [ ] **TEST & COMMIT**

---

## Phase 5: Remove Bootstrap ⏸️
- [ ] Replace react-bootstrap-slider with Ant Design Slider
- [ ] Remove Bootstrap from package.json
- [ ] Clean up SCSS files
- [ ] **TEST & COMMIT**

---

## Phase 6: Convert Utilities to Hooks ⏸️
Components to convert:
- [ ] `DynamicOptionList`
- [ ] `DynamicColumnList`
- [ ] `PlaceHolder`
- [ ] `ToolbarItem`
- [ ] `FixedRowList`
- [ ] **TEST & COMMIT**

---

## Phase 7: Convert Basic Form Elements ⏸️
Components to convert:
- [ ] `Header`
- [ ] `Paragraph`
- [ ] `Label`
- [ ] `LineBreak`
- [ ] `TextInput`
- [ ] `NumberInput`
- [ ] `TextArea`
- [ ] `Dropdown`
- [ ] `Checkboxes`
- [ ] `RadioButtons`
- [ ] **TEST & COMMIT**

---

## Phase 8: Convert Complex Form Elements ⏸️
Components to convert:
- [ ] `Signature`
- [ ] `Tags`
- [ ] `DatePicker`
- [ ] `StarRating`
- [ ] `Table`
- [ ] `FileUpload`
- [ ] `ImageUpload`
- [ ] `CustomElement`
- [ ] `DataSource`
- [ ] **TEST & COMMIT**

---

## Phase 9: Context API ⏸️
- [ ] Create `FormContext`
- [ ] Create `ElementsContext`
- [ ] Create `ValidationContext`
- [ ] Create `useFormData` hook
- [ ] Create `useFormElements` hook
- [ ] Create `useFormValidation` hook
- [ ] Create `useFormActions` hook
- [ ] **TEST & COMMIT**

---

## Phase 10: Convert Toolbar & Preview ⏸️
- [ ] Convert `Toolbar` to functional
- [ ] Convert `Preview` to functional
- [ ] Convert `SortableElement` to functional
- [ ] Convert `SortableFormElements` to functional
- [ ] Integrate with Context API
- [ ] **TEST & COMMIT**

---

## Phase 11: Convert Core Components ⏸️
- [ ] Convert `ReactFormBuilder` to functional
- [ ] Convert `ReactFormGenerator` to functional
- [ ] Convert `FormValidator` to functional
- [ ] Ensure backward compatible API
- [ ] **TEST & COMMIT**

---

## Phase 12: Reorganize Structure ⏸️
- [ ] Create new folder structure
- [ ] Move components to appropriate folders
- [ ] Update all imports
- [ ] Create barrel exports
- [ ] **TEST & COMMIT**

---

## Phase 13: Consolidate Examples ⏸️
- [ ] Keep Next.js + MongoDB example
- [ ] Remove old examples
- [ ] Update example README
- [ ] **TEST & COMMIT**

---

## Phase 14: Update Dependencies ⏸️
- [ ] Update axios (SECURITY)
- [ ] Update react-datepicker
- [ ] Update react-select
- [ ] Update draft-js or find alternative
- [ ] Remove unused dependencies
- [ ] **TEST & COMMIT**

---

## Phase 15: TypeScript (Optional) ⏸️
- [ ] Add TypeScript config
- [ ] Install type dependencies
- [ ] Convert files incrementally
- [ ] Add type definitions
- [ ] **TEST & COMMIT**

---

## Phase 16: Testing & Docs ⏸️
- [ ] Set up Vitest + RTL
- [ ] Write component tests
- [ ] Write hook tests
- [ ] Update README
- [ ] Create MIGRATION.md guide
- [ ] **TEST & COMMIT**

---

## Phase 17: Performance ⏸️
- [ ] Add React.memo
- [ ] Add useMemo/useCallback
- [ ] Code splitting
- [ ] Bundle optimization
- [ ] **TEST & COMMIT**

---

## Phase 18: Release ⏸️
- [ ] Full regression testing
- [ ] Update version to 1.0.0
- [ ] Update CHANGELOG
- [ ] Create release notes
- [ ] Publish to npm
- [ ] Update documentation

---

## Testing After Each Phase

### Quick Test Checklist:
1. [ ] `npm run build` - succeeds
2. [ ] `npm start` - dev server runs
3. [ ] Open browser - no console errors
4. [ ] Drag element from toolbar - works
5. [ ] Drop element in form - works
6. [ ] Edit element properties - works
7. [ ] Delete element - works
8. [ ] Generate form - works
9. [ ] Submit form - works

### Before Committing:
```bash
npm run build
npm start
# Manual testing in browser
git add .
git commit -m "phase-X: description"
git push origin feat/modernization
```

---

## Emergency Rollback

If something breaks badly:
```bash
git stash
git checkout main
# Or go back to specific commit
git checkout <commit-hash>
```

---

## Useful Commands

### Find class components:
```bash
grep -r "class.*extends.*Component" src/
```

### Find Bootstrap usage:
```bash
grep -r "react-bootstrap\|bootstrap" src/
```

### Check bundle size:
```bash
npm run build
ls -lh dist/
```

### Security audit:
```bash
npm audit
npm audit fix
```

---

## Progress Tracking

**Started**: ___________
**Current Phase**: _____
**Expected Completion**: ___________

**Phases Completed**: 0/18 (0%)

---

## Notes & Issues

(Document any issues or decisions made during migration)

-
-
-

---

## Quick Wins (Do These First!)

1. **Phase 1-2**: Setup (30 min)
2. **Phase 3**: Vite migration (big dev experience improvement)
3. **Phase 4**: React 18 (foundation for everything else)
4. **Phase 5**: Remove Bootstrap (simplifies styling)

**After these 4 phases, you'll have a much better developer experience!**
