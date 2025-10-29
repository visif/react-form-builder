"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDateFormat = exports.getCalendarType = exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireDefault(require("react"));
var _antd = require("antd");
var _dayjs = _interopRequireDefault(require("dayjs"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
var _utc = _interopRequireDefault(require("dayjs/plugin/utc"));
var _buddhistEra = _interopRequireDefault(require("dayjs/plugin/buddhistEra"));
_dayjs["default"].extend(_utc["default"]);
_dayjs["default"].extend(_buddhistEra["default"]);
var keyDateFormat = "setting_date_format";
var keyCalendarType = "setting_calendar_type";
var dateFormatList = {
  "dd MMMM yyyy": "DD MMMM YYYY",
  "dd-MMM-yyyy": "DD-MMM-YYYY",
  "dd-MMM-yy": "DD-MMM-YY",
  "yyyy-MM-dd": "YYYY-MM-DD",
  "MM/dd/yyyy": "MM/DD/YYYY",
  "dd/MM/yyyy": "DD/MM/YYYY",
  "dd/MM/yy": "DD/MM/YY",
  "MMM dd, yyyy": "MMM DD, YYYY"
};
var dateTimeFormatList = {
  "dd MMMM yyyy": "DD MMMM YYYY HH:MM",
  "dd-MMM-yyyy": "DD-MMM-YYYY HH:MM",
  "dd-MMM-yy": "DD-MMM-YY HH:MM",
  "yyyy-MM-dd": "YYYY-MM-DD HH:MM",
  "MM/dd/yyyy": "MM/DD/YYYY HH:MM",
  "dd/MM/yyyy": "DD/MM/YYYY HH:MM",
  "dd/MM/yy": "DD/MM/YY HH:MM",
  "MMM dd, yyyy": "MMM DD, YYYY HH:MM"
};
var getDateFormat = exports.getDateFormat = function getDateFormat(showTimeSelect) {
  var key = showTimeSelect ? dateTimeFormatList[localStorage.getItem(keyDateFormat)] : dateFormatList[localStorage.getItem(keyDateFormat)];
  return key || (showTimeSelect ? "DD MMMM YYYY HH:MM" : "DD MMMM YYYY");
};
var getCalendarType = exports.getCalendarType = function getCalendarType() {
  var key = localStorage.getItem(keyCalendarType);
  return key || "EN";
};
var DatePicker = function DatePicker(props) {
  var inputField = _react["default"].useRef(null);
  var mounted = _react["default"].useRef(false);
  var updateFormat = _react["default"].useCallback(function (oldFormatMask) {
    var formatMask = getDateFormat(props.data.showTimeSelect);
    var updated = formatMask !== oldFormatMask;
    return {
      updated: updated,
      formatMask: formatMask
    };
  }, [props.data.showTimeSelect]);
  var updateDateTime = _react["default"].useCallback(function (formatMask) {
    var value;
    var defaultToday = props.data.defaultToday;
    if (defaultToday && !props.defaultValue) {
      value = (0, _dayjs["default"])().toISOString();
    } else if (props.defaultValue) {
      try {
        // Use formatMask for parsing if available
        value = (0, _dayjs["default"])(props.defaultValue, formatMask).isValid() ? (0, _dayjs["default"])(props.defaultValue, formatMask).toISOString() : (0, _dayjs["default"])(props.defaultValue).utc(true).toISOString();
      } catch (error) {
        console.warn('Invalid date value:', props.defaultValue);
        value = null;
      }
    }
    return {
      value: value,
      placeholder: formatMask.toLowerCase(),
      defaultToday: defaultToday,
      formatMask: formatMask,
      defaultValue: props.defaultValue
    };
  }, [props.data, props.defaultValue]);
  var _updateFormat = updateFormat(null),
    initialFormatMask = _updateFormat.formatMask;
  var initialState = updateDateTime(initialFormatMask);
  var _React$useState = _react["default"].useState(initialState.value),
    _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
    value = _React$useState2[0],
    setValue = _React$useState2[1];
  var _React$useState3 = _react["default"].useState(initialState.placeholder),
    _React$useState4 = (0, _slicedToArray2["default"])(_React$useState3, 2),
    placeholder = _React$useState4[0],
    setPlaceholder = _React$useState4[1];
  var _React$useState5 = _react["default"].useState(initialState.formatMask),
    _React$useState6 = (0, _slicedToArray2["default"])(_React$useState5, 2),
    formatMask = _React$useState6[0],
    setFormatMask = _React$useState6[1];
  var _React$useState7 = _react["default"].useState(true),
    _React$useState8 = (0, _slicedToArray2["default"])(_React$useState7, 2),
    loading = _React$useState8[0],
    setLoading = _React$useState8[1];
  var checkForValue = _react["default"].useCallback(function () {
    var attempt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var maxRetries = 3;
    if (!value && props.defaultValue) {
      // If value hasn't loaded yet, check again in a moment
      setTimeout(function () {
        if (mounted.current && !value) {
          var updated = updateDateTime(formatMask);
          setValue(updated.value);
          setPlaceholder(updated.placeholder);
          setLoading(false);
          // Keep checking if still no value and attempts are less than maxRetries
          if (!value && attempt < maxRetries) {
            checkForValue(attempt + 1);
          }
        }
      }, 500);
    } else {
      setLoading(false);
    }
  }, [value, props.defaultValue, formatMask, updateDateTime]);
  _react["default"].useEffect(function () {
    mounted.current = true;
    checkForValue();
    return function () {
      mounted.current = false;
    };
  }, [checkForValue]);
  _react["default"].useEffect(function () {
    if (props.defaultValue && props.defaultValue !== value) {
      var _updateFormat2 = updateFormat(formatMask),
        newFormatMask = _updateFormat2.formatMask;
      var updated = updateDateTime(newFormatMask);
      setValue(updated.value);
      setPlaceholder(updated.placeholder);
      setFormatMask(updated.formatMask);
    }
  }, [props.defaultValue, value, formatMask, updateFormat, updateDateTime]);
  var handleChange = _react["default"].useCallback(function (date) {
    var isoDate = date ? date.toISOString() : null;
    setValue(isoDate);
    setPlaceholder(formatMask.toLowerCase());
  }, [formatMask]);
  var handleTimeChange = _react["default"].useCallback(function (time) {
    var isoTime = time ? time.toISOString() : null;
    setValue(isoTime);
    setPlaceholder('HH:MM');
  }, []);
  var formatDate = _react["default"].useCallback(function (date, mask) {
    if (!date) return '';
    if (getCalendarType() === 'EN') {
      return (0, _dayjs["default"])(date).utc(true).format(mask);
    } else {
      // Convert to Buddhist calendar (add 543 years)
      return (0, _dayjs["default"])(date).utc(true).format(mask.replace('YYYY', 'BBBB'));
    }
  }, []);
  var _props$data = props.data,
    showTimeSelect = _props$data.showTimeSelect,
    showTimeSelectOnly = _props$data.showTimeSelectOnly;
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
  }
  var inputProps = {
    type: 'date',
    className: 'form-control',
    name: props.data.field_name
  };
  var readOnly = props.data.readOnly || props.read_only || !isSameEditor;
  if (props.mutable) {
    inputProps.defaultValue = props.defaultValue;
    inputProps.ref = inputField;
  }
  var baseClasses = 'SortableItem rfb-item';
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement("div", null, readOnly ? /*#__PURE__*/_react["default"].createElement("input", {
    type: "text",
    name: inputProps.name,
    ref: inputProps.ref,
    readOnly: readOnly,
    placeholder: placeholder,
    value: value ? formatDate(value, formatMask) : '',
    disabled: !isSameEditor,
    className: "form-control"
  }) : !showTimeSelectOnly ? /*#__PURE__*/_react["default"].createElement(_antd.DatePicker, {
    name: inputProps.name,
    ref: inputProps.ref,
    onChange: handleChange,
    value: value ? (0, _dayjs["default"])(value).utc(true) : null,
    className: "form-control bold-date-picker",
    format: function format(val) {
      return formatDate(val, formatMask);
    },
    showTime: showTimeSelect ? {
      format: 'HH:mm',
      showSecond: false
    } : null,
    disabled: !isSameEditor || loading,
    placeholder: placeholder,
    style: {
      display: 'inline-block',
      width: 'auto'
    }
  }) : /*#__PURE__*/_react["default"].createElement(_antd.TimePicker, {
    name: inputProps.name,
    ref: inputProps.ref,
    onChange: handleTimeChange,
    value: value ? (0, _dayjs["default"])(value).utc(true) : null,
    className: "form-control bold-time-picker",
    disabled: !isSameEditor || loading,
    placeholder: placeholder,
    style: {
      display: 'inline-block',
      width: 'auto'
    },
    format: "HH:mm",
    minuteStep: 1
  }))));
};
var _default = exports["default"] = DatePicker;