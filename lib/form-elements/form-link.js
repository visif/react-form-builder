"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t3 in e) "default" !== _t3 && {}.hasOwnProperty.call(e, _t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t3)) && (i.get || i.set) ? o(f, _t3, i) : f[_t3] = e[_t3]); return f; })(e, t); }
// Inline styles extracted as constants for better readability
var STYLES = {
  container: {
    position: 'relative',
    display: 'inline-block',
    width: '100%'
  },
  linkContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  selectBox: function selectBox(isSelected) {
    return {
      flex: 1,
      border: '1px solid #ced4da',
      borderRadius: '.25rem',
      padding: '6px 12px',
      cursor: 'pointer',
      backgroundColor: isSelected ? '#fff' : '#f8f9fa',
      minHeight: '38px',
      display: 'flex',
      alignItems: 'center'
    };
  },
  previewContainer: {
    padding: '6px 0'
  },
  previewButton: {
    marginTop: 6
  }
};

// Custom hook for loading and managing form data
var useFormData = function useFormData(data, getFormSource, getFormInfo) {
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    formList = _useState2[0],
    setFormList = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    formInfo = _useState4[0],
    setFormInfo = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    selectedForm = _useState6[0],
    setSelectedForm = _useState6[1];
  var _useState7 = (0, _react.useState)(true),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    loading = _useState8[0],
    setLoading = _useState8[1];
  var isMounted = (0, _react.useRef)(true);
  (0, _react.useEffect)(function () {
    isMounted.current = true;
    return function () {
      isMounted.current = false;
    };
  }, []);

  // Load available forms from the source
  var loadForms = (0, _react.useCallback)(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var forms, preselectedForm, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!(typeof getFormSource !== 'function')) {
            _context.next = 1;
            break;
          }
          setLoading(false);
          return _context.abrupt("return");
        case 1:
          _context.prev = 1;
          _context.next = 2;
          return getFormSource(data);
        case 2:
          forms = _context.sent;
          if (isMounted.current) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return");
        case 3:
          setFormList(forms);
          console.log('useFormData - loadForms:', {
            dataFormSource: data.formSource,
            formsLength: forms.length,
            forms: forms
          });

          // If a formSource is already set, find and select it
          if (data.formSource) {
            preselectedForm = forms.find(function (form) {
              return form.id == data.formSource;
            });
            console.log('useFormData - preselectedForm:', preselectedForm);
            if (preselectedForm) {
              setSelectedForm(preselectedForm);
            }
          }
          _context.next = 5;
          break;
        case 4:
          _context.prev = 4;
          _t = _context["catch"](1);
          console.warn('Error loading form source:', _t);
          if (isMounted.current) {
            setFormList([]);
          }
        case 5:
          _context.prev = 5;
          if (isMounted.current) {
            setLoading(false);
          }
          return _context.finish(5);
        case 6:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 4, 5, 6]]);
  })), [data, getFormSource]);

  // Load detailed info about the selected form
  var loadFormInfo = (0, _react.useCallback)(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var info, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (!(typeof getFormInfo !== 'function' || !data.formSource)) {
            _context2.next = 1;
            break;
          }
          return _context2.abrupt("return");
        case 1:
          _context2.prev = 1;
          _context2.next = 2;
          return getFormInfo(data.formSource);
        case 2:
          info = _context2.sent;
          if (isMounted.current) {
            setFormInfo(info || null);
          }
          _context2.next = 4;
          break;
        case 3:
          _context2.prev = 3;
          _t2 = _context2["catch"](1);
          console.warn('Error loading form info:', _t2);
          if (isMounted.current) {
            setFormInfo(null);
          }
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 3]]);
  })), [data.formSource, getFormInfo]);
  (0, _react.useEffect)(function () {
    loadForms();
  }, [loadForms]);
  (0, _react.useEffect)(function () {
    loadFormInfo();
  }, [loadFormInfo]);
  return {
    formList: formList,
    formInfo: formInfo,
    selectedForm: selectedForm,
    setSelectedForm: setSelectedForm,
    loading: loading
  };
};

// Custom hook for editor permissions
var useEditorPermissions = function useEditorPermissions(editor, selectedForm, getActiveUserProperties) {
  var userProperties = getActiveUserProperties === null || getActiveUserProperties === void 0 ? void 0 : getActiveUserProperties();
  var hasValue = selectedForm !== null;

  // Determine if the current user can edit this field
  var canEdit = function () {
    if (!hasValue) return true;
    if (!(editor !== null && editor !== void 0 && editor.userId) || !userProperties) return true;
    return userProperties.userId === editor.userId || userProperties.hasDCCRole === true;
  }();

  // Tooltip showing who last edited
  var tooltipText = editor !== null && editor !== void 0 && editor.name && hasValue ? "Edited by: ".concat(editor.name) : '';
  return {
    canEdit: canEdit,
    tooltipText: tooltipText
  };
};

// Sub-component for the form selector display
var FormSelector = function FormSelector(_ref3) {
  var selectedForm = _ref3.selectedForm,
    formInfo = _ref3.formInfo,
    onSelectChildForm = _ref3.onSelectChildForm,
    openLinkedForm = _ref3.openLinkedForm,
    data = _ref3.data;
  var isFormSelected = !!selectedForm;
  var displayText = (formInfo === null || formInfo === void 0 ? void 0 : formInfo.Name) || 'Please select a form';
  var handleClick = function handleClick(e) {
    e.preventDefault();
    console.log('FormLink Debug:', {
      isFormSelected: isFormSelected,
      selectedForm: selectedForm,
      dataFormSource: data.formSource,
      dataId: data.id,
      formInfo: formInfo,
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
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: STYLES.container
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-link-container",
    style: STYLES.linkContainer
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-link-preview",
    style: STYLES.previewContainer
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: "#",
    style: STYLES.previewButton,
    className: "btn btn-secondary",
    onClick: handleClick
  }, displayText))));
};

// Main component refactored as a functional component
var FormLink = function FormLink(props) {
  var data = props.data,
    defaultValue = props.defaultValue,
    editor = props.editor,
    getFormSource = props.getFormSource,
    getFormInfo = props.getFormInfo,
    getActiveUserProperties = props.getActiveUserProperties,
    onElementChange = props.onElementChange,
    updateElement = props.updateElement,
    onSelectChildForm = props.onSelectChildForm,
    openLinkedForm = props.openLinkedForm;

  // Custom hooks for data and permissions
  var _useFormData = useFormData(data, getFormSource, getFormInfo),
    formList = _useFormData.formList,
    formInfo = _useFormData.formInfo,
    selectedForm = _useFormData.selectedForm,
    setSelectedForm = _useFormData.setSelectedForm,
    loading = _useFormData.loading;
  var _useEditorPermissions = useEditorPermissions(editor, selectedForm, getActiveUserProperties),
    canEdit = _useEditorPermissions.canEdit,
    tooltipText = _useEditorPermissions.tooltipText;

  // Sync with defaultValue prop changes
  (0, _react.useEffect)(function () {
    if (defaultValue !== null && defaultValue !== void 0 && defaultValue.selectedFormId && defaultValue.selectedFormId !== selectedForm) {
      setSelectedForm(defaultValue.selectedFormId);
    }
  }, [defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.selectedFormId, selectedForm, setSelectedForm]);

  // Build CSS classes
  var baseClasses = [data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem', data.pageBreakBefore ? 'alwaysbreak' : ''].filter(Boolean).join(' ');
  var wrapperClass = data.isShowLabel !== false ? 'form-group' : '';
  if (loading) {
    return /*#__PURE__*/_react["default"].createElement("div", null, "Loading...");
  }
  return /*#__PURE__*/_react["default"].createElement("section", {
    className: baseClasses,
    title: tooltipText
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: wrapperClass
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], (0, _extends2["default"])({}, props, {
    style: {
      display: 'block'
    }
  })), /*#__PURE__*/_react["default"].createElement(FormSelector
  // selectedForm={selectedForm}
  , {
    formInfo: formInfo,
    onSelectChildForm: onSelectChildForm,
    openLinkedForm: openLinkedForm,
    data: data
  })));
};
var _default = exports["default"] = FormLink;