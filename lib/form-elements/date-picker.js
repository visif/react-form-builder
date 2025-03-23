"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDateFormat = exports.getCalendarType = exports.default = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _antd = require("antd");
var _dayjs = _interopRequireDefault(require("dayjs"));
var _buddhistEra = _interopRequireDefault(require("dayjs/plugin/buddhistEra"));
var _utc = _interopRequireDefault(require("dayjs/plugin/utc"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
<<<<<<< HEAD
_dayjs.default.extend(_utc.default);
_dayjs.default.extend(_buddhistEra.default);
var keyDateFormat = "setting_date_format";
var keyCalendarType = "setting_calendar_type";
=======
_dayjs["default"].extend(_utc["default"]);
_dayjs["default"].extend(_buddhistEra["default"]);
var keyDateFormat = 'setting_date_format';
var keyCalendarType = 'setting_calendar_type';
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
var dateFormatList = {
  'dd MMMM yyyy': 'DD MMMM YYYY',
  'dd-MMM-yyyy': 'DD-MMM-YYYY',
  'dd-MMM-yy': 'DD-MMM-YY',
  'yyyy-MM-dd': 'YYYY-MM-DD',
  'MM/dd/yyyy': 'MM/DD/YYYY',
  'dd/MM/yyyy': 'DD/MM/YYYY',
  'MMM dd, yyyy': 'MMM DD, YYYY'
};
<<<<<<< HEAD
var dateTimeFormatList = {
  "dd MMMM yyyy": "DD MMMM YYYY HH:MM",
  "dd-MMM-yyyy": "DD-MMM-YYYY HH:MM",
  "dd-MMM-yy": "DD-MMM-YY HH:MM",
  "yyyy-MM-dd": "YYYY-MM-DD HH:MM",
  "MM/dd/yyyy": "MM/DD/YYYY HH:MM",
  "dd/MM/yyyy": "DD/MM/YYYY HH:MM",
  "MMM dd, yyyy": "MMM DD, YYYY HH:MM"
};
var getDateFormat = function getDateFormat(showTimeSelect) {
  var key = showTimeSelect ? dateTimeFormatList[localStorage.getItem(keyDateFormat)] : dateFormatList[localStorage.getItem(keyDateFormat)];
  return key || (showTimeSelect ? "DD MMMM YYYY HH:MM" : "DD MMMM YYYY");
=======
var getDateFormat = function getDateFormat() {
  var key = dateFormatList[localStorage.getItem(keyDateFormat)];
  return key || 'DD MMMM YYYY';
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
};
exports.getDateFormat = getDateFormat;
var getCalendarType = function getCalendarType() {
  var key = localStorage.getItem(keyCalendarType);
  return key || 'EN';
};
exports.getCalendarType = getCalendarType;
var DatePicker = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(DatePicker, _React$Component);
  var _super = _createSuper(DatePicker);
  function DatePicker(props) {
    var _this;
    (0, _classCallCheck2.default)(this, DatePicker);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "checkForValue", function () {
      var attempt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var defaultValue = _this.props.defaultValue;
      var maxRetries = 3;
      if (!_this.state.value && defaultValue) {
        // If value hasn't loaded yet, check again in a moment
        setTimeout(function () {
          if (_this.mounted && !_this.state.value) {
            var formatMask = _this.state.formatMask;
            _this.setState(_objectSpread(_objectSpread({}, DatePicker.updateDateTime(_this.props, formatMask)), {}, {
              loading: false
            }));
            // Keep checking if still no value and attempts are less than maxRetries
            if (!_this.state.value && attempt < maxRetries) {
              _this.checkForValue(attempt + 1);
            }
          }
        }, 500);
      } else {
        _this.setState({
          loading: false
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleChange", function (date) {
      var formatMask = _this.state.formatMask;
      var isoDate = date ? date.toISOString() : null;
      _this.setState({
        value: isoDate,
        placeholder: formatMask.toLowerCase()
      });
    });
<<<<<<< HEAD
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleTimeChange", function (time) {
      var isoTime = time ? time.toISOString() : null;
      _this.setState({
        value: isoTime,
        placeholder: "HH:MM"
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "formatDate", function (date, formatMask) {
      if (!date) return "";
      ;
      if (getCalendarType() === "EN") {
        return (0, _dayjs.default)(date).utc(true).format(formatMask);
=======
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "formatDate", function (date, formatMask) {
      if (!date) return '';
      if (getCalendarType() === 'EN') {
        return (0, _dayjs["default"])(date).utc(true).format(formatMask);
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
      } else {
        // Convert to Buddhist calendar (add 543 years)
        return (0, _dayjs.default)(date).utc(true).format(formatMask.replace('YYYY', 'BBBB'));
      }
    });
    _this.inputField = /*#__PURE__*/_react.default.createRef();
    _this.mounted = false;
    var _DatePicker$updateFor = DatePicker.updateFormat(props, null),
      _formatMask = _DatePicker$updateFor.formatMask;
    _this.state = _objectSpread(_objectSpread({}, DatePicker.updateDateTime(props, _formatMask)), {}, {
      loading: true
    });
    return _this;
  }
  (0, _createClass2.default)(DatePicker, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.mounted = true;
      this.checkForValue();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props$data = this.props.data,
        showTimeSelect = _this$props$data.showTimeSelect,
        showTimeSelectOnly = _this$props$data.showTimeSelectOnly;
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId;
      }
      var props = {
        type: 'date',
        className: 'form-control',
        name: this.props.data.field_name
      };
      var readOnly = this.props.data.readOnly || this.props.read_only || !isSameEditor;
      if (this.props.mutable) {
        props.defaultValue = this.props.defaultValue;
        props.ref = this.inputField;
      }
      var baseClasses = 'SortableItem rfb-item';
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      return /*#__PURE__*/_react.default.createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react.default.createElement(_componentLabel.default, this.props), /*#__PURE__*/_react.default.createElement("div", null, readOnly ? /*#__PURE__*/_react.default.createElement("input", {
        type: "text",
        name: props.name,
        ref: props.ref,
        readOnly: readOnly,
        placeholder: this.state.placeholder,
        value: this.state.value ? this.formatDate(this.state.value, this.state.formatMask) : '',
        disabled: !isSameEditor,
        className: "form-control"
      }) : !showTimeSelectOnly ? /*#__PURE__*/_react.default.createElement(_antd.DatePicker, {
        name: props.name,
        ref: props.ref,
        onChange: this.handleChange,
        value: this.state.value ? (0, _dayjs.default)(this.state.value).utc(true) : null,
        className: "form-control bold-date-picker",
        format: function format(value) {
          return _this2.formatDate(value, _this2.state.formatMask);
        },
        showTime: showTimeSelect ? {
          format: "HH:mm",
          showSecond: false
        } : null,
        disabled: !isSameEditor || this.state.loading,
        placeholder: this.state.placeholder,
        style: {
          display: 'inline-block',
          width: 'auto'
        }
      }) : /*#__PURE__*/_react.default.createElement(_antd.TimePicker, {
        name: props.name,
        ref: props.ref,
        onChange: this.handleTimeChange,
        value: this.state.value ? (0, _dayjs.default)(this.state.value).utc(true) : null,
        className: "form-control bold-time-picker",
        disabled: !isSameEditor || this.state.loading,
        placeholder: this.state.placeholder,
        style: {
          display: "inline-block",
          width: "auto"
        },
        format: "HH:mm",
        minuteStep: 1
      }))));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (props.defaultValue && props.defaultValue !== state.defaultValue) {
        var _DatePicker$updateFor2 = DatePicker.updateFormat(props, null),
          formatMask = _DatePicker$updateFor2.formatMask;
        return DatePicker.updateDateTime(props, formatMask);
      }
      return null;
    }
  }, {
    key: "updateFormat",
    value: function updateFormat(props, oldFormatMask) {
      var formatMask = getDateFormat(props.data.showTimeSelect);
      var updated = formatMask !== oldFormatMask;
      return {
        updated: updated,
        formatMask: formatMask
      };
    }
  }, {
    key: "updateDateTime",
    value: function updateDateTime(props, formatMask) {
      var value;
      var defaultToday = props.data.defaultToday;
      if (defaultToday && !props.defaultValue) {
        value = (0, _dayjs.default)().toISOString();
      } else if (props.defaultValue) {
        try {
          var isMMDDYYYY = /^\d{2}\/\d{2}\/\d{4}$/.test(props.defaultValue);
          if (isMMDDYYYY) {
<<<<<<< HEAD
            value = (0, _dayjs.default)(props.defaultValue, "MM/DD/YYYY").toISOString();
=======
            value = (0, _dayjs["default"])(props.defaultValue, 'MM/DD/YYYY').toISOString();
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
          } else {
            value = (0, _dayjs.default)(props.defaultValue).utc(true).toISOString();
          }
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
    }
  }]);
  return DatePicker;
}(_react.default.Component);
var _default = DatePicker;
exports.default = _default;