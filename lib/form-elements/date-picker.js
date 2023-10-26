"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _dateFns = require("date-fns");
var _reactDatepicker = _interopRequireDefault(require("react-datepicker"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var DatePicker = /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
  var updateFormat = function updateFormat(props, oldFormatMask) {
    var _props$data = props.data,
      showTimeSelect = _props$data.showTimeSelect,
      showTimeSelectOnly = _props$data.showTimeSelectOnly;
    var dateFormat = showTimeSelect && showTimeSelectOnly ? "" : props.data.dateFormat;
    var timeFormat = showTimeSelect ? props.data.timeFormat : "";
    var formatMask = "".concat(dateFormat, " ").concat(timeFormat).trim();
    var updated = formatMask !== oldFormatMask;
    return {
      updated: updated,
      formatMask: formatMask
    };
  };
  var updateDateTime = function updateDateTime(props, state, formatMask) {
    var value;
    var internalValue;
    var defaultToday = props.data.defaultToday;
    if (defaultToday && (props.defaultValue === "" || props.defaultValue === undefined)) {
      value = (0, _dateFns.format)(new Date(), formatMask);
      internalValue = new Date();
    } else {
      value = props.defaultValue;
      if (value === "" || value === undefined) {
        internalValue = undefined;
      } else {
        internalValue = parse(value, state.formatMask, new Date());
      }
    }
    return {
      value: value,
      internalValue: internalValue,
      placeholder: formatMask.toLowerCase(),
      defaultToday: defaultToday,
      formatMask: state.formatMask,
      defaultValue: props.defaultValue
    };
  };
  var _useState = (0, _react.useState)(function () {
      var _updateFormat = updateFormat(props, null),
        formatMask = _updateFormat.formatMask;
      return updateDateTime(props, {
        formatMask: formatMask
      }, formatMask);
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    state = _useState2[0],
    setState = _useState2[1];
  (0, _react.useEffect)(function () {
    var _updateFormat2 = updateFormat(props, state.formatMask),
      updated = _updateFormat2.updated,
      formatMask = _updateFormat2.formatMask;
    if (updated || props.data.defaultToday !== state.defaultToday || state.defaultValue !== props.defaultValue) {
      var newState = updateDateTime(props, state, formatMask);
      setState(newState);
    }
  }, [props, state]);
  var handleChange = function handleChange(dt) {
    var placeholder;
    var formatMask = state.formatMask;
    if (dt && dt.target) {
      placeholder = dt && dt.target && dt.target.value === "" ? formatMask.toLowerCase() : "";
      var formattedDate = dt.target.value ? (0, _dateFns.format)(dt.target.value, formatMask) : "";
      setState(function (prevState) {
        return _objectSpread(_objectSpread({}, prevState), {}, {
          value: formattedDate,
          internalValue: formattedDate,
          placeholder: placeholder
        });
      });
    } else {
      setState(function (prevState) {
        return _objectSpread(_objectSpread({}, prevState), {}, {
          value: dt ? (0, _dateFns.format)(dt, formatMask) : "",
          internalValue: dt,
          placeholder: placeholder
        });
      });
    }
  };
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }
  var _props$data2 = props.data,
    showTimeSelect = _props$data2.showTimeSelect,
    showTimeSelectOnly = _props$data2.showTimeSelectOnly;
  var inputProps = {};
  inputProps.type = "date";
  inputProps.className = "form-control";
  inputProps.name = props.data.field_name;
  //const readOnly = props.data.readOnly || props.read_only;
  var readOnly = props.data.readOnly || props.read_only || !isSameEditor;
  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  var placeholderText = state.formatMask.toLowerCase();
  if (props.mutable) {
    inputProps.defaultValue = props.defaultValue;
    inputProps.ref = ref;
  }
  var baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement("div", null, readOnly && /*#__PURE__*/_react["default"].createElement("input", {
    type: "text",
    name: inputProps.name,
    ref: inputProps.ref,
    readOnly: readOnly,
    placeholder: state.placeholder,
    value: state.value,
    disabled: !isSameEditor,
    className: "form-control"
  }), iOS && !readOnly && /*#__PURE__*/_react["default"].createElement("input", {
    type: "date",
    name: inputProps.name,
    ref: inputProps.ref,
    onChange: handleChange,
    dateFormat: "MM/DD/YYYY",
    placeholder: state.placeholder,
    value: state.value,
    disabled: !isSameEditor,
    className: "form-control"
  }), !iOS && !readOnly && /*#__PURE__*/_react["default"].createElement(_reactDatepicker["default"], {
    name: props.name,
    ref: ref,
    onChange: handleChange,
    selected: state.internalValue,
    todayButton: "Today",
    className: "form-control",
    isClearable: true,
    showTimeSelect: showTimeSelect,
    showTimeSelectOnly: showTimeSelectOnly,
    dateFormat: state.formatMask,
    portalId: "root-portal",
    autoComplete: "off",
    disabled: !isSameEditor,
    placeholderText: placeholderText
  }))));
});
var _default = DatePicker;
exports["default"] = _default;