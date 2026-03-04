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
      const isoDate = date ? date.toISOString() : null;
      this.setState({
        value: isoDate,
        placeholder: formatMask.toLowerCase()
      });
    });
    (0, _defineProperty2.default)(this, "handleTimeChange", time => {
      const isoTime = time ? time.toISOString() : null;
      this.setState({
        value: isoTime,
        placeholder: 'HH:MM'
      });
    });
    (0, _defineProperty2.default)(this, "formatDate", (date, formatMask) => {
      if (!date) return '';
      if (getCalendarType() === 'EN') {
        return (0, _dayjs.default)(date).utc(true).format(formatMask);
      } else {
        // Convert to Buddhist calendar (add 543 years)
        return (0, _dayjs.default)(date).utc(true).format(formatMask.replace('YYYY', 'BBBB'));
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
      defaultToday
    } = props.data;
    if (defaultToday && !props.defaultValue) {
      value = (0, _dayjs.default)().toISOString();
    } else if (props.defaultValue) {
      try {
        // Use formatMask for parsing if available
        value = (0, _dayjs.default)(props.defaultValue, formatMask).isValid() ? (0, _dayjs.default)(props.defaultValue, formatMask).toISOString() : (0, _dayjs.default)(props.defaultValue).utc(true).toISOString();
      } catch (error) {
        console.warn('Invalid date value:', props.defaultValue);
        value = null;
      }
    }
    return {
      value,
      placeholder: formatMask.toLowerCase(),
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
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "".concat(this.state.value ? this.formatDate(this.state.value, this.state.formatMask) : '', "\nEdited by: ").concat(savedEditor.name) : '';
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
      value: this.state.value ? this.formatDate(this.state.value, this.state.formatMask) : '',
      disabled: !isSameEditor,
      className: "form-control"
    }) : !showTimeSelectOnly ? /*#__PURE__*/_react.default.createElement(_antd.DatePicker, {
      name: props.name,
      ref: props.ref,
      onChange: this.handleChange,
      value: this.state.value ? (0, _dayjs.default)(this.state.value).utc(true) : null,
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
      onChange: this.handleTimeChange,
      value: this.state.value ? (0, _dayjs.default)(this.state.value).utc(true) : null,
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