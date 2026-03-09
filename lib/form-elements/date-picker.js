"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDateFormat = exports.getCalendarType = exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _antd = require("antd");
var _dayjs = _interopRequireDefault(require("dayjs"));
var _buddhistEra = _interopRequireDefault(require("dayjs/plugin/buddhistEra"));
var _utc = _interopRequireDefault(require("dayjs/plugin/utc"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
_dayjs.default.extend(_utc.default);
_dayjs.default.extend(_buddhistEra.default);
const keyDateFormat = 'setting_date_format';
const keyCalendarType = 'setting_calendar_type';
const dateFormatList = {
  'dd MMMM yyyy': 'DD MMMM YYYY',
  'dd-MMM-yyyy': 'DD-MMM-YYYY',
  'dd-MMM-yy': 'DD-MMM-YY',
  'yyyy-MM-dd': 'YYYY-MM-DD',
  'MM/dd/yyyy': 'MM/DD/YYYY',
  'dd/MM/yyyy': 'DD/MM/YYYY',
  'dd/MM/yy': 'DD/MM/YY',
  'MMM dd, yyyy': 'MMM DD, YYYY'
};
const dateTimeFormatList = {
  'dd MMMM yyyy': 'DD MMMM YYYY HH:MM',
  'dd-MMM-yyyy': 'DD-MMM-YYYY HH:MM',
  'dd-MMM-yy': 'DD-MMM-YY HH:MM',
  'yyyy-MM-dd': 'YYYY-MM-DD HH:MM',
  'MM/dd/yyyy': 'MM/DD/YYYY HH:MM',
  'dd/MM/yyyy': 'DD/MM/YYYY HH:MM',
  'dd/MM/yy': 'DD/MM/YY HH:MM',
  'MMM dd, yyyy': 'MMM DD, YYYY HH:MM'
};
const getDateFormat = showTimeSelect => {
  const key = showTimeSelect ? dateTimeFormatList[localStorage.getItem(keyDateFormat)] : dateFormatList[localStorage.getItem(keyDateFormat)];
  return key || (showTimeSelect ? 'DD MMMM YYYY HH:MM' : 'DD MMMM YYYY');
};
exports.getDateFormat = getDateFormat;
const getCalendarType = () => {
  var key = localStorage.getItem(keyCalendarType);
  return key || 'EN';
};
exports.getCalendarType = getCalendarType;
class DatePicker extends _react.default.Component {
  constructor(props) {
    var _this;
    super(props);
    _this = this;
    (0, _defineProperty2.default)(this, "checkForValue", function () {
      let attempt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      const {
        defaultValue
      } = _this.props;
      const maxRetries = 3;
      if (!_this.state.value && defaultValue) {
        // If value hasn't loaded yet, check again in a moment
        setTimeout(() => {
          if (_this.mounted && !_this.state.value) {
            const {
              formatMask
            } = _this.state;
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
    (0, _defineProperty2.default)(this, "handleChange", date => {
      const {
        formatMask
      } = this.state;
      // Lock exact selected numbers by forging a UTC string directly from the digits
      const isoDate = date ? _dayjs.default.utc(date.format('YYYY-MM-DDTHH:mm:ss')).toISOString() : null;
      console.log('Saved Date (Locked Digits):', isoDate); // Added for verification
      this.setState({
        value: isoDate,
        placeholder: formatMask.toLowerCase()
      });
    });
    (0, _defineProperty2.default)(this, "handleTimeChange", time => {
      // Keep exact time, append to today's date, and lock digits into UTC
      const isoTime = time ? _dayjs.default.utc("".concat((0, _dayjs.default)().format('YYYY-MM-DD'), "T").concat(time.format('HH:mm:ss'))).toISOString() : null;
      console.log('Saved Time (Locked Digits):', isoTime); // Added for verification
      this.setState({
        value: isoTime,
        placeholder: 'HH:mm'
      });
    });
    (0, _defineProperty2.default)(this, "formatDate", (date, formatMask) => {
      if (!date) return '';

      // Read the exact digits out of the UTC string and treat them as local so they don't shift!
      const lockedDate = (0, _dayjs.default)(_dayjs.default.utc(date).format('YYYY-MM-DDTHH:mm:ss'));
      if (getCalendarType() === 'EN') {
        return lockedDate.format(formatMask);
      } else {
        // Convert to Buddhist calendar (add 543 years)
        return lockedDate.format(formatMask.replace('YYYY', 'BBBB'));
      }
    });
    this.inputField = /*#__PURE__*/_react.default.createRef();
    this.mounted = false;
    const {
      formatMask: _formatMask
    } = DatePicker.updateFormat(props, null);
    this.state = _objectSpread(_objectSpread({}, DatePicker.updateDateTime(props, _formatMask)), {}, {
      loading: true
    });
  }
  componentDidMount() {
    this.mounted = true;
    this.checkForValue();
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  static getDerivedStateFromProps(props, state) {
    if (props.defaultValue && props.defaultValue !== state.defaultValue) {
      const {
        formatMask
      } = DatePicker.updateFormat(props, null);
      return DatePicker.updateDateTime(props, formatMask);
    }
    return null;
  }
  static updateFormat(props, oldFormatMask) {
    const formatMask = getDateFormat(props.data.showTimeSelect);
    const updated = formatMask !== oldFormatMask;
    return {
      updated,
      formatMask
    };
  }
  static updateDateTime(props, formatMask) {
    let value;
    const {
      defaultToday,
      showTimeSelectOnly
    } = props.data;
    if (defaultToday && !props.defaultValue) {
      if (showTimeSelectOnly) {
        value = _dayjs.default.utc("".concat((0, _dayjs.default)().format('YYYY-MM-DD'), "T").concat((0, _dayjs.default)().format('HH:mm:ss'))).toISOString();
      } else {
        value = _dayjs.default.utc((0, _dayjs.default)().format('YYYY-MM-DDTHH:mm:ss')).toISOString();
      }
    } else if (props.defaultValue) {
      try {
        // Use formatMask for parsing if available without shifting local time
        value = (0, _dayjs.default)(props.defaultValue, formatMask).isValid() ? _dayjs.default.utc(_dayjs.default.utc(props.defaultValue, formatMask).format('YYYY-MM-DDTHH:mm:ss')).toISOString() : _dayjs.default.utc(_dayjs.default.utc(props.defaultValue).format('YYYY-MM-DDTHH:mm:ss')).toISOString();
      } catch (error) {
        console.warn('Invalid date value:', props.defaultValue);
        value = null;
      }
    }
    return {
      value,
      placeholder: props.data.showTimeSelectOnly ? 'HH:mm' : formatMask.toLowerCase(),
      defaultToday,
      formatMask,
      defaultValue: props.defaultValue
    };
  }
  render() {
    const {
      showTimeSelect,
      showTimeSelectOnly
    } = this.props.data;
    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
    const savedEditor = this.props.editor;
    const hasValue = this.state.value && this.state.value.toString().trim() !== '';

    // Allow editing if no value exists OR if user is the same editor
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }

    // Create tooltip text showing editor name
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "".concat(this.state.value ? this.formatDate(this.state.value, showTimeSelectOnly ? 'HH:mm' : this.state.formatMask) : '', "\nEdited by: ").concat(savedEditor.name) : '';
    const props = {
      type: 'date',
      className: 'form-control',
      name: this.props.data.field_name
    };
    if (tooltipText) {
      props.title = tooltipText;
    }
    const readOnly = this.props.data.readOnly || this.props.read_only || !isSameEditor;
    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }
    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group",
      title: tooltipText
    }, /*#__PURE__*/_react.default.createElement(_componentLabel.default, this.props), /*#__PURE__*/_react.default.createElement("div", null, readOnly ? /*#__PURE__*/_react.default.createElement("input", {
      type: "text",
      name: props.name,
      ref: props.ref,
      readOnly: readOnly,
      placeholder: this.state.placeholder,
      value: this.state.value ? this.formatDate(this.state.value, showTimeSelectOnly ? 'HH:mm' : this.state.formatMask) : '',
      disabled: !isSameEditor,
      className: "form-control"
    }) : !showTimeSelectOnly ? /*#__PURE__*/_react.default.createElement(_antd.DatePicker, {
      name: props.name,
      ref: props.ref,
      onChange: this.handleChange
      // Convert UTC string digits identically into local dayjs instance preventing shifts
      ,
      value: this.state.value ? (0, _dayjs.default)(_dayjs.default.utc(this.state.value).format('YYYY-MM-DDTHH:mm:ss')) : null,
      className: "form-control bold-date-picker",
      format: value => this.formatDate(value, this.state.formatMask),
      showTime: showTimeSelect ? {
        format: 'HH:mm',
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
      onChange: this.handleTimeChange
      // Convert UTC string digits identically into local dayjs instance preventing shifts
      ,
      value: this.state.value ? (0, _dayjs.default)(_dayjs.default.utc(this.state.value).format('YYYY-MM-DDTHH:mm:ss')) : null,
      className: "form-control bold-time-picker",
      disabled: !isSameEditor || this.state.loading,
      placeholder: this.state.placeholder,
      style: {
        display: 'inline-block',
        width: 'auto'
      },
      format: "HH:mm",
      minuteStep: 1
    }))));
  }
}
var _default = exports.default = DatePicker;