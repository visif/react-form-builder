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
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
  var loadForms = (0, _react.useCallback)( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var forms, preselectedForm;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!(typeof getFormSource !== 'function')) {
            _context.next = 3;
            break;
          }
          setLoading(false);
          return _context.abrupt("return");
        case 3:
          _context.prev = 3;
          _context.next = 6;
          return getFormSource(data);
        case 6:
          forms = _context.sent;
          if (isMounted.current) {
            _context.next = 9;
            break;
          }
          return _context.abrupt("return");
        case 9:
          setFormList(forms);

          // If a formSource is already set, find and select it
          if (data.formSource) {
            preselectedForm = forms.find(function (form) {
              return form.id == data.formSource;
            });
            if (preselectedForm) {
              setSelectedForm(preselectedForm);
            }
          }
          _context.next = 17;
          break;
        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](3);
          console.warn('Error loading form source:', _context.t0);
          if (isMounted.current) {
            setFormList([]);
          }
        case 17:
          _context.prev = 17;
          if (isMounted.current) {
            setLoading(false);
          }
          return _context.finish(17);
        case 20:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[3, 13, 17, 20]]);
  })), [data, getFormSource]);

  // Load detailed info about the selected form
  var loadFormInfo = (0, _react.useCallback)( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var info;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          debugger;
          if (!(typeof getFormInfo !== 'function' || !data.formSource)) {
            _context2.next = 3;
            break;
          }
          return _context2.abrupt("return");
        case 3:
          _context2.prev = 3;
          _context2.next = 6;
          return getFormInfo(data.formSource);
        case 6:
          info = _context2.sent;
          if (isMounted.current) {
            setFormInfo(info || null);
          }
          _context2.next = 14;
          break;
        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](3);
          console.warn('Error loading form info:', _context2.t0);
          if (isMounted.current) {
            setFormInfo(null);
          }
        case 14:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[3, 10]]);
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
  })), /*#__PURE__*/_react["default"].createElement(FormSelector, {
    selectedForm: selectedForm,
    formInfo: formInfo,
    onSelectChildForm: onSelectChildForm,
    openLinkedForm: openLinkedForm,
    data: data
  })));
};
var _default = FormLink;
exports["default"] = _default;