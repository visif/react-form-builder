"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// Inline styles extracted as constants for better readability
const STYLES = {
  container: {
    position: 'relative',
    display: 'inline-block',
    width: '100%'
  },
  linkContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  selectBox: isSelected => ({
    flex: 1,
    border: '1px solid #ced4da',
    borderRadius: '.25rem',
    padding: '6px 12px',
    cursor: 'pointer',
    backgroundColor: isSelected ? '#fff' : '#f8f9fa',
    minHeight: '38px',
    display: 'flex',
    alignItems: 'center'
  }),
  previewContainer: {
    padding: '6px 0'
  },
  previewButton: {
    marginTop: 6
  }
};

// Custom hook for loading and managing form data
const useFormData = (data, getFormSource, getFormInfo) => {
  const [formList, setFormList] = (0, _react.useState)([]);
  const [formInfo, setFormInfo] = (0, _react.useState)(null);
  const [selectedForm, setSelectedForm] = (0, _react.useState)(null);
  const [loading, setLoading] = (0, _react.useState)(true);
  const isMounted = (0, _react.useRef)(true);
  (0, _react.useEffect)(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Load available forms from the source
  const loadForms = (0, _react.useCallback)(async () => {
    if (typeof getFormSource !== 'function') {
      setLoading(false);
      return;
    }
    try {
      const forms = await getFormSource(data);
      if (!isMounted.current) return;
      setFormList(forms);
      console.log('useFormData - loadForms:', {
        dataFormSource: data.formSource,
        formsLength: forms.length,
        forms
      });

      // If a formSource is already set, find and select it
      if (data.formSource) {
        const preselectedForm = forms.find(form => form.id == data.formSource);
        console.log('useFormData - preselectedForm:', preselectedForm);
        if (preselectedForm) {
          setSelectedForm(preselectedForm);
        }
      }
    } catch (error) {
      console.warn('Error loading form source:', error);
      if (isMounted.current) {
        setFormList([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [data, getFormSource]);

  // Load detailed info about the selected form
  const loadFormInfo = (0, _react.useCallback)(async () => {
    if (typeof getFormInfo !== 'function' || !data.formSource) {
      return;
    }
    try {
      const info = await getFormInfo(data.formSource);
      if (isMounted.current) {
        setFormInfo(info || null);
      }
    } catch (error) {
      console.warn('Error loading form info:', error);
      if (isMounted.current) {
        setFormInfo(null);
      }
    }
  }, [data.formSource, getFormInfo]);
  (0, _react.useEffect)(() => {
    loadForms();
  }, [loadForms]);
  (0, _react.useEffect)(() => {
    loadFormInfo();
  }, [loadFormInfo]);
  return {
    formList,
    formInfo,
    selectedForm,
    setSelectedForm,
    loading
  };
};

// Custom hook for editor permissions
const useEditorPermissions = (editor, selectedForm, getActiveUserProperties) => {
  const userProperties = getActiveUserProperties === null || getActiveUserProperties === void 0 ? void 0 : getActiveUserProperties();
  const hasValue = selectedForm !== null;

  // Determine if the current user can edit this field
  const canEdit = (() => {
    if (!hasValue) return true;
    if (!(editor !== null && editor !== void 0 && editor.userId) || !userProperties) return true;
    return userProperties.userId === editor.userId || userProperties.hasDCCRole === true;
  })();

  // Tooltip showing who last edited
  const tooltipText = editor !== null && editor !== void 0 && editor.name && hasValue ? "Edited by: ".concat(editor.name) : '';
  return {
    canEdit,
    tooltipText
  };
};

// Sub-component for the form selector display
const FormSelector = _ref => {
  let {
    selectedForm,
    formInfo,
    onSelectChildForm,
    openLinkedForm,
    data
  } = _ref;
  const isFormSelected = !!selectedForm;
  const displayText = (formInfo === null || formInfo === void 0 ? void 0 : formInfo.Name) || 'Please select a form';
  const handleClick = e => {
    e.preventDefault();
    console.log('FormLink Debug:', {
      isFormSelected,
      selectedForm,
      dataFormSource: data.formSource,
      dataId: data.id,
      formInfo,
      hasOnSelectChildForm: typeof onSelectChildForm === 'function',
      hasOpenLinkedForm: typeof openLinkedForm === 'function'
    });

    // If form is selected, open it; otherwise, trigger form selection
    if (isFormSelected && data.formSource) {
      if (typeof openLinkedForm === 'function') {
        openLinkedForm(data.formSource);
      }
    } else if (typeof onSelectChildForm === 'function') {
      onSelectChildForm(data.id, data.formSource);
    }
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    style: STYLES.container
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "form-link-container",
    style: STYLES.linkContainer
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "form-link-preview",
    style: STYLES.previewContainer
  }, /*#__PURE__*/_react.default.createElement("a", {
    href: "#",
    style: STYLES.previewButton,
    className: "btn btn-secondary",
    onClick: handleClick
  }, displayText))));
};

// Main component refactored as a functional component
const FormLink = props => {
  const {
    data,
    defaultValue,
    editor,
    getFormSource,
    getFormInfo,
    getActiveUserProperties,
    onElementChange,
    updateElement,
    onSelectChildForm,
    openLinkedForm
  } = props;

  // Custom hooks for data and permissions
  const {
    formList,
    formInfo,
    selectedForm,
    setSelectedForm,
    loading
  } = useFormData(data, getFormSource, getFormInfo);
  const {
    canEdit,
    tooltipText
  } = useEditorPermissions(editor, selectedForm, getActiveUserProperties);

  // Sync with defaultValue prop changes
  (0, _react.useEffect)(() => {
    if (defaultValue !== null && defaultValue !== void 0 && defaultValue.selectedFormId && defaultValue.selectedFormId !== selectedForm) {
      setSelectedForm(defaultValue.selectedFormId);
    }
  }, [defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.selectedFormId, selectedForm, setSelectedForm]);

  // Build CSS classes
  const baseClasses = [data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem', data.pageBreakBefore ? 'alwaysbreak' : ''].filter(Boolean).join(' ');
  const wrapperClass = data.isShowLabel !== false ? 'form-group' : '';
  if (loading) {
    return /*#__PURE__*/_react.default.createElement("div", null, "Loading...");
  }
  return /*#__PURE__*/_react.default.createElement("section", {
    className: baseClasses,
    title: tooltipText
  }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, props), /*#__PURE__*/_react.default.createElement("div", {
    className: wrapperClass
  }, /*#__PURE__*/_react.default.createElement(_componentLabel.default, (0, _extends2.default)({}, props, {
    style: {
      display: 'block'
    }
  })), /*#__PURE__*/_react.default.createElement(FormSelector
  // selectedForm={selectedForm}
  , {
    formInfo: formInfo,
    onSelectChildForm: onSelectChildForm,
    openLinkedForm: openLinkedForm,
    data: data
  })));
};
var _default = exports.default = FormLink;