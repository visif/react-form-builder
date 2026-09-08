"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDateFormat = exports.getCalendarType = exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _antd = require("antd");
var _generatePicker = _interopRequireDefault(require("antd/es/date-picker/generatePicker"));
var _dayjs = _interopRequireDefault(require("rc-picker/lib/generate/dayjs"));
var _dayjs2 = _interopRequireDefault(require("dayjs"));
var _buddhistEra = _interopRequireDefault(require("dayjs/plugin/buddhistEra"));
var _localeData = _interopRequireDefault(require("dayjs/plugin/localeData"));
var _advancedFormat = _interopRequireDefault(require("dayjs/plugin/advancedFormat"));
var _weekOfYear = _interopRequireDefault(require("dayjs/plugin/weekOfYear"));
var _th = _interopRequireDefault(require("dayjs/locale/th"));
var _customParseFormat = _interopRequireDefault(require("dayjs/plugin/customParseFormat"));
var _localizedFormat = _interopRequireDefault(require("dayjs/plugin/localizedFormat"));
var _utc = _interopRequireDefault(require("dayjs/plugin/utc"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
_dayjs2.default.extend(_utc.default);
_dayjs2.default.extend(_advancedFormat.default);
_dayjs2.default.extend(_localeData.default);
_dayjs2.default.extend(_weekOfYear.default);
_dayjs2.default.extend(_buddhistEra.default);
_dayjs2.default.extend(_customParseFormat.default);
_dayjs2.default.extend(_localizedFormat.default);

// Thai month names for Buddhist calendar
const THAI_MONTHS_FULL = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
const THAI_MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const buddhistConfig = _objectSpread(_objectSpread({}, _dayjs.default), {}, {
  getFixedDate: string => (0, _dayjs2.default)(string, ['DD/MM/YYYY'], 'en'),
  setYear: (date, year) => date.year(year - 543),
  getYear: date => {
    if (_dayjs2.default.isDayjs(date)) {
      return date.year() + 543;
    } else if (typeof date === 'string') {
      const dayjsDate = (0, _dayjs2.default)(date);
      return dayjsDate.year() + 543;
    } else {
      return null;
    }
  },
  locale: {
    getWeekFirstDay: locale => (0, _dayjs2.default)().locale('th').localeData().firstDayOfWeek(),
    getWeekFirstDate: (locale, date) => date.locale('th').day(0),
    getWeek: (locale, date) => date.locale('th').week(),
    getShortWeekDays: locale => (0, _dayjs2.default)().locale('th').localeData().weekdaysMin(),
    getShortMonths: locale => (0, _dayjs2.default)().locale('th').localeData().monthsShort(),
    format: (locale, date, format) => {
      const yearInBE = date.year() + 543;
      const yearPart = format.includes('YYYY') || format.includes('BBBB') ? yearInBE.toString() : yearInBE.toString().slice(-2);
      const monthFull = THAI_MONTHS_FULL[date.month()];
      const monthShort = THAI_MONTHS_SHORT[date.month()];
      const monthNumber = date.format('MM');
      const dayPadded = date.format('DD'); // "01" .. "31"
      const dayNum = date.format('D'); // "1"  .. "31"
      const hour24 = date.format('HH');
      const hour12 = date.format('hh');
      const minute = date.format('mm');
      const second = date.format('ss');
      const ampmUpper = date.format('A');
      const ampmLower = date.format('a');

      // Replace longer tokens first to avoid partial collisions.
      // Time tokens must be handled here too — otherwise datetime masks like
      // "DD/MM/YY HH:mm" render as "24/07/69 HH:mm" with literal HH:mm.
      let formattedDate = format.replace('MMMM', monthFull).replace('MMM', monthShort).replace('MM', monthNumber).replace('DD', dayPadded) // two-digit day
      .replace(/(?<!D)D(?!D)/g, dayNum) // single D not part of DD
      .replace('BBBB', yearPart).replace(/(?<!B)BB(?!B)/g, yearPart.slice(-2)).replace('YYYY', yearPart).replace(/(?<!Y)YY(?!Y)/g, yearPart.slice(-2)) // standalone YY only
      .replace('HH', hour24).replace('hh', hour12).replace('mm', minute).replace('ss', second).replace('A', ampmUpper).replace('a', ampmLower);

      // rc-picker requests single-token formats (e.g. "D") for calendar cells.
      if (formattedDate === format) {
        return date.locale('th').format(format);
      }
      return formattedDate;
    },
    parse: (locale, text, formats) => {
      for (let i = 0; i < formats.length; i += 1) {
        const format = formats[i];
        const date = (0, _dayjs2.default)(text, format, true).locale('th');
        if (date.isValid()) {
          return date;
        }
      }
      return null;
    }
  }
});
const DatePickerTH = (0, _generatePicker.default)(buddhistConfig);
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
  'dd MMMM yyyy': 'DD MMMM YYYY HH:mm',
  'dd-MMM-yyyy': 'DD-MMM-YYYY HH:mm',
  'dd-MMM-yy': 'DD-MMM-YY HH:mm',
  'yyyy-MM-dd': 'YYYY-MM-DD HH:mm',
  'MM/dd/yyyy': 'MM/DD/YYYY HH:mm',
  'dd/MM/yyyy': 'DD/MM/YYYY HH:mm',
  'dd/MM/yy': 'DD/MM/YY HH:mm',
  'MMM dd, yyyy': 'MMM DD, YYYY HH:mm'
};
const getDateFormat = showTimeSelect => {
  const key = showTimeSelect ? dateTimeFormatList[localStorage.getItem(keyDateFormat)] : dateFormatList[localStorage.getItem(keyDateFormat)];
  return key || (showTimeSelect ? 'DD MMMM YYYY HH:mm' : 'DD MMMM YYYY');
};
exports.getDateFormat = getDateFormat;
const getCalendarType = () => {
  var key = localStorage.getItem(keyCalendarType);
  return key || 'EN';
};

// Helper: convert a dayjs format mask to Buddhist Era format safely
exports.getCalendarType = getCalendarType;
const toBuddhistFormat = formatMask => {
  return formatMask.replace('YYYY', 'BBBB').replace(/(?<!B)YY(?![Y])/g, 'BB');
};
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
        setTimeout(() => {
          if (_this.mounted && !_this.state.value) {
            const {
              formatMask
            } = _this.state;
            _this.setState(_objectSpread(_objectSpread({}, DatePicker.updateDateTime(_this.props, formatMask)), {}, {
              loading: false
            }));
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
      const calendarType = getCalendarType();
      let lockedDate = null;
      if (date) {
        let year = date.year();
        if (calendarType === 'TH' || calendarType !== 'EN') {
          if (year > 2500) {
            year = year - 543;
          }
        }
        const correctedDate = date.clone().year(year);
        lockedDate = correctedDate.format('YYYY-MM-DDTHH:mm:ss');
        lockedDate = (0, _dayjs2.default)(lockedDate).toISOString();
      }
      console.log('Saved Date:', lockedDate);
      this.setState({
        value: lockedDate,
        placeholder: formatMask.toLowerCase()
      });
    });
    (0, _defineProperty2.default)(this, "handleTimeChange", time => {
      const isoTime = time ? time.toISOString() : null;
      console.log('Saved Time (Real UTC Math):', isoTime);
      this.setState({
        value: isoTime,
        placeholder: 'HH:mm'
      });
    });
    (0, _defineProperty2.default)(this, "formatDate", (date, formatMask) => {
      if (!date) return '';
      const localDate = (0, _dayjs2.default)(date);
      if (getCalendarType() === 'EN') {
        return localDate.format(formatMask);
      } else {
        return localDate.format(toBuddhistFormat(formatMask));
      }
    });
    (0, _defineProperty2.default)(this, "getPickerFormat", () => {
      const {
        formatMask
      } = this.state;
      const calendarType = getCalendarType();
      return calendarType === 'EN' ? formatMask : toBuddhistFormat(formatMask);
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
    const calendarType = getCalendarType();
    if (defaultToday && !props.defaultValue) {
      value = (0, _dayjs2.default)().toISOString();
    } else if (props.defaultValue) {
      try {
        let parsedDate = (0, _dayjs2.default)(props.defaultValue, formatMask);
        if (parsedDate.isValid()) {
          if (calendarType !== 'EN' && parsedDate.year() > 2500) {
            parsedDate = parsedDate.year(parsedDate.year() - 543);
          }
          value = parsedDate.toISOString();
        } else {
          let fallbackDate = (0, _dayjs2.default)(props.defaultValue);
          if (calendarType !== 'EN' && fallbackDate.year() > 2500) {
            fallbackDate = fallbackDate.year(fallbackDate.year() - 543);
          }
          value = fallbackDate.toISOString();
        }
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
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }
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
    const calendarType = getCalendarType();
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
    }) : !showTimeSelectOnly ? calendarType === 'EN' ? /*#__PURE__*/_react.default.createElement(_antd.DatePicker, {
      name: props.name,
      ref: props.ref,
      onChange: this.handleChange,
      value: this.state.value ? (0, _dayjs2.default)(this.state.value) : null,
      className: "form-control bold-date-picker",
      format: this.getPickerFormat(),
      showTime: showTimeSelect ? {
        format: 'HH:mm',
        showSecond: false
      } : null,
      disabled: !isSameEditor || this.state.loading,
      placeholder: this.state.placeholder,
      getPopupContainer: () => document.body,
      styles: {
        popup: {
          root: {
            zIndex: 2100
          }
        }
      },
      style: {
        display: 'inline-block',
        width: 'auto'
      }
    }) : /*#__PURE__*/_react.default.createElement(DatePickerTH, {
      name: props.name,
      ref: props.ref,
      onChange: this.handleChange,
      value: this.state.value ? (0, _dayjs2.default)(this.state.value) : null,
      className: "form-control bold-date-picker",
      format: this.getPickerFormat(),
      showTime: showTimeSelect ? {
        format: 'HH:mm',
        showSecond: false
      } : null,
      disabled: !isSameEditor || this.state.loading,
      placeholder: this.state.placeholder,
      getPopupContainer: () => document.body,
      styles: {
        popup: {
          root: {
            zIndex: 2100
          }
        }
      },
      style: {
        display: 'inline-block',
        width: 'auto'
      }
    }) : /*#__PURE__*/_react.default.createElement(_antd.TimePicker, {
      name: props.name,
      ref: props.ref,
      onChange: this.handleTimeChange,
      value: this.state.value ? (0, _dayjs2.default)(this.state.value) : null,
      className: "form-control bold-time-picker",
      disabled: !isSameEditor || this.state.loading,
      placeholder: this.state.placeholder,
      getPopupContainer: () => document.body,
      styles: {
        popup: {
          root: {
            zIndex: 2100
          }
        }
      },
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