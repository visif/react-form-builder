"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireDefault(require("react"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var FormLink = function FormLink(props) {
  var inputField = _react["default"].useRef(null);
  var mounted = _react["default"].useRef(false);
  var defaultValue = props.defaultValue || {};
  var _React$useState = _react["default"].useState([]),
    _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
    formList = _React$useState2[0],
    setFormList = _React$useState2[1];
  var _React$useState3 = _react["default"].useState([]),
    _React$useState4 = (0, _slicedToArray2["default"])(_React$useState3, 2),
    matchedList = _React$useState4[0],
    setMatchedList = _React$useState4[1];
  var _React$useState5 = _react["default"].useState(null),
    _React$useState6 = (0, _slicedToArray2["default"])(_React$useState5, 2),
    formInfo = _React$useState6[0],
    setFormInfo = _React$useState6[1];
  var _React$useState7 = _react["default"].useState(defaultValue.value || ''),
    _React$useState8 = (0, _slicedToArray2["default"])(_React$useState7, 2),
    searchText = _React$useState8[0],
    setSearchText = _React$useState8[1];
  var _React$useState9 = _react["default"].useState(defaultValue.selectedFormId),
    _React$useState0 = (0, _slicedToArray2["default"])(_React$useState9, 2),
    selectedFormId = _React$useState0[0],
    setSelectedFormId = _React$useState0[1];
  var _React$useState1 = _react["default"].useState(defaultValue.selectedForm),
    _React$useState10 = (0, _slicedToArray2["default"])(_React$useState1, 2),
    defaultSelectedForm = _React$useState10[0],
    setDefaultSelectedForm = _React$useState10[1];
  var _React$useState11 = _react["default"].useState(false),
    _React$useState12 = (0, _slicedToArray2["default"])(_React$useState11, 2),
    isShowingList = _React$useState12[0],
    setIsShowingList = _React$useState12[1];
  var _React$useState13 = _react["default"].useState(true),
    _React$useState14 = (0, _slicedToArray2["default"])(_React$useState13, 2),
    loading = _React$useState14[0],
    setLoading = _React$useState14[1];
  var checkForValue = _react["default"].useCallback(function () {
    var _props$defaultValue;
    var attempt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var maxRetries = 3;
    if (!selectedFormId && (_props$defaultValue = props.defaultValue) !== null && _props$defaultValue !== void 0 && _props$defaultValue.selectedFormId) {
      setTimeout(function () {
        if (mounted.current && !selectedFormId) {
          setSearchText(props.defaultValue.value || '');
          setSelectedFormId(props.defaultValue.selectedFormId);
          setDefaultSelectedForm(props.defaultValue.selectedFormId);
          setLoading(false);
          if (!selectedFormId && attempt < maxRetries) {
            checkForValue(attempt + 1);
          }
        }
      }, 500);
    } else {
      setLoading(false);
    }
  }, [selectedFormId, props.defaultValue]);
  var loadFormSource = _react["default"].useCallback(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var forms, selectedForm, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!(typeof props.getFormSource === 'function')) {
            _context.next = 6;
            break;
          }
          _context.prev = 1;
          _context.next = 2;
          return props.getFormSource(props.data);
        case 2:
          forms = _context.sent;
          if (!mounted.current) {
            _context.next = 4;
            break;
          }
          if (!props.data.formSource) {
            _context.next = 3;
            break;
          }
          selectedForm = forms.find(function (form) {
            return form.id == props.data.formSource;
          });
          if (!selectedForm) {
            _context.next = 3;
            break;
          }
          setFormList(forms);
          setMatchedList(forms);
          setSelectedFormId(selectedForm);
          setSearchText('');
          return _context.abrupt("return");
        case 3:
          setFormList(forms);
          setMatchedList(forms);
        case 4:
          _context.next = 6;
          break;
        case 5:
          _context.prev = 5;
          _t = _context["catch"](1);
          console.warn('Error loading form source:', _t);
          if (mounted.current) {
            setFormList([]);
            setMatchedList([]);
          }
        case 6:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 5]]);
  })), [props]);
  _react["default"].useEffect(function () {
    mounted.current = true;
    var init = /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var info, _t2;
        return _regenerator["default"].wrap(function (_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 1;
              return loadFormSource();
            case 1:
              checkForValue();
              if (!(typeof props.getFormInfo === 'function' && props.data.formSource)) {
                _context2.next = 5;
                break;
              }
              _context2.prev = 2;
              _context2.next = 3;
              return props.getFormInfo(props.data.formSource);
            case 3:
              info = _context2.sent;
              if (mounted.current) {
                setFormInfo(info || null);
              }
              _context2.next = 5;
              break;
            case 4:
              _context2.prev = 4;
              _t2 = _context2["catch"](2);
              console.warn('Error loading form info:', _t2);
              if (mounted.current) {
                setFormInfo(null);
              }
            case 5:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[2, 4]]);
      }));
      return function init() {
        return _ref2.apply(this, arguments);
      };
    }();
    init();
    return function () {
      mounted.current = false;
    };
  }, [loadFormSource, checkForValue, props]);
  _react["default"].useEffect(function () {
    if (props.defaultValue && JSON.stringify(props.defaultValue.selectedFormId) !== JSON.stringify(defaultSelectedForm)) {
      var newDefaultValue = props.defaultValue || {};
      setSearchText(newDefaultValue.value || '');
      setSelectedFormId(newDefaultValue.selectedFormId);
      setDefaultSelectedForm(newDefaultValue.selectedFormId);
    }
  }, [props.defaultValue, defaultSelectedForm]);
  var handleInputFocus = _react["default"].useCallback(function () {
    setIsShowingList(true);
  }, []);
  var handleInputBlur = _react["default"].useCallback(function () {
    setTimeout(function () {
      setIsShowingList(false);
    }, 200);
  }, []);
  var debounceOnChange = _react["default"].useCallback(function (value) {
    var matchData = formList.filter(function (form) {
      return "".concat(form.title).toLocaleLowerCase().includes("".concat(value).toLocaleLowerCase());
    });
    setSearchText(value);
    setMatchedList(matchData);

    // If onElementChange is provided, call it to synchronize changes across the column
    if (props.onElementChange) {
      var updatedData = _objectSpread(_objectSpread({}, props.data), {}, {
        value: value
      });
      props.onElementChange(updatedData);

      // Immediately apply changes to this component's data
      if (props.data.dirty === undefined || props.data.dirty) {
        updatedData.dirty = true;
        if (props.updateElement) {
          props.updateElement(updatedData);
        }
      }
    }
  }, [formList, props]);
  var handleOnChange = _react["default"].useCallback(function (event) {
    if (event.key === 'Enter') {
      return;
    }
    debounceOnChange(event.target.value);
  }, [debounceOnChange]);
  var handleFormSelect = _react["default"].useCallback(function (form) {
    setSelectedFormId(form);
    setSearchText(form.title);
    setIsShowingList(false);

    // If onElementChange is provided, call it to synchronize changes across the column
    if (props.onElementChange) {
      var updatedData = _objectSpread(_objectSpread({}, props.data), {}, {
        value: form.title,
        selectedFormId: form,
        formSource: form.id // Save the form ID as formSource
      });
      props.onElementChange(updatedData);

      // Immediately apply changes to this component's data
      if (props.data.dirty === undefined || props.data.dirty) {
        updatedData.dirty = true;
        if (props.updateElement) {
          props.updateElement(updatedData);
        }
      }
    }
  }, [props]);
  var openLinkedForm = _react["default"].useCallback(function () {
    console.info("Select form: ".concat(selectedFormId));
    if (selectedFormId && typeof props.openLinkedForm === 'function') {
      props.openLinkedForm(selectedFormId);
    }
  }, [selectedFormId, props]);
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
  }
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  var formTitle = selectedFormId ? selectedFormId.title : 'Select a form';
  var isFormSelected = !!selectedFormId;
  return /*#__PURE__*/_react["default"].createElement("section", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: props.data.isShowLabel !== false ? 'form-group' : ''
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], (0, _extends2["default"])({}, props, {
    style: {
      display: 'block'
    }
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-block',
      width: '100%'
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-link-container",
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    onClick: function onClick() {
      return setIsShowingList(true);
    },
    style: {
      flex: 1,
      border: '1px solid #ced4da',
      borderRadius: '.25rem',
      padding: '6px 12px',
      cursor: 'pointer',
      backgroundColor: isFormSelected ? '#fff' : '#f8f9fa',
      minHeight: '38px',
      display: 'flex',
      alignItems: 'center'
    }
  }, isFormSelected ? /*#__PURE__*/_react["default"].createElement("span", null, formInfo ? formInfo.Name : 'Please select a form') : /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-link-preview",
    style: {
      padding: '6px 0'
    }
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: "#",
    style: {
      marginTop: 6
    },
    className: "btn btn-secondary",
    onClick: function onClick(e) {
      e.preventDefault();
      if (typeof props.onSelectChildForm === 'function') {
        props.onSelectChildForm(props.data.id, props.data.formSource);
      }
    }
  }, formInfo ? formInfo.Name : 'Please select a form'))))))));
};
var _default = exports["default"] = FormLink;