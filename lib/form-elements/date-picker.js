"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDateFormat = exports.getCalendarType = exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
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
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
_dayjs2["default"].extend(_utc["default"]);
_dayjs2["default"].extend(_advancedFormat["default"]);
_dayjs2["default"].extend(_localeData["default"]);
_dayjs2["default"].extend(_weekOfYear["default"]);
_dayjs2["default"].extend(_buddhistEra["default"]);
_dayjs2["default"].extend(_customParseFormat["default"]);
_dayjs2["default"].extend(_localizedFormat["default"]);

// Thai month names for Buddhist calendar
var THAI_MONTHS_FULL = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
var THAI_MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
var buddhistConfig = _objectSpread(_objectSpread({}, _dayjs["default"]), {}, {
  getFixedDate: function getFixedDate(string) {
    return (0, _dayjs2["default"])(string, ['DD/MM/YYYY'], 'en');
  },
  setYear: function setYear(date, year) {
    return date.year(year - 543);
  },
  getYear: function getYear(date) {
    if (_dayjs2["default"].isDayjs(date)) {
      return date.year() + 543;
    } else if (typeof date === 'string') {
      var dayjsDate = (0, _dayjs2["default"])(date);
      return dayjsDate.year() + 543;
    } else {
      return null;
    }
  },
  locale: {
    getWeekFirstDay: function getWeekFirstDay(locale) {
      return (0, _dayjs2["default"])().locale('th').localeData().firstDayOfWeek();
    },
    getWeekFirstDate: function getWeekFirstDate(locale, date) {
      return date.locale('th').day(0);
    },
    getWeek: function getWeek(locale, date) {
      return date.locale('th').week();
    },
    getShortWeekDays: function getShortWeekDays(locale) {
      return (0, _dayjs2["default"])().locale('th').localeData().weekdaysMin();
    },
    getShortMonths: function getShortMonths(locale) {
      return (0, _dayjs2["default"])().locale('th').localeData().monthsShort();
    },
    format: function format(locale, date, _format) {
      var yearInBE = date.year() + 543;
      var yearPart = _format.includes('YYYY') || _format.includes('BBBB') ? yearInBE.toString() : yearInBE.toString().slice(-2);
      var monthFull = THAI_MONTHS_FULL[date.month()];
      var monthShort = THAI_MONTHS_SHORT[date.month()];
      var monthNumber = date.format('MM');
      var dayPadded = date.format('DD'); // "01" .. "31"
      var dayNum = date.format('D'); // "1"  .. "31"
      var hour24 = date.format('HH');
      var hour12 = date.format('hh');
      var minute = date.format('mm');
      var second = date.format('ss');
      var ampmUpper = date.format('A');
      var ampmLower = date.format('a');

      // Replace longer tokens first to avoid partial collisions.
      // Time tokens must be handled here too — otherwise datetime masks like
      // "DD/MM/YY HH:mm" render as "24/07/69 HH:mm" with literal HH:mm.
      var formattedDate = _format.replace('MMMM', monthFull).replace('MMM', monthShort).replace('MM', monthNumber).replace('DD', dayPadded) // two-digit day
      .replace(/(?<!D)D(?!D)/g, dayNum) // single D not part of DD
      .replace('BBBB', yearPart).replace(/(?<!B)BB(?!B)/g, yearPart.slice(-2)).replace('YYYY', yearPart).replace(/(?<!Y)YY(?!Y)/g, yearPart.slice(-2)) // standalone YY only
      .replace('HH', hour24).replace('hh', hour12).replace('mm', minute).replace('ss', second).replace('A', ampmUpper).replace('a', ampmLower);

      // rc-picker requests single-token formats (e.g. "D") for calendar cells.
      if (formattedDate === _format) {
        return date.locale('th').format(_format);
      }
      return formattedDate;
    },
    parse: function parse(locale, text, formats) {
      for (var i = 0; i < formats.length; i += 1) {
        var format = formats[i];
        var date = (0, _dayjs2["default"])(text, format, true).locale('th');
        if (date.isValid()) {
          return date;
        }
      }
      return null;
    }
  }
});
var DatePickerTH = (0, _generatePicker["default"])(buddhistConfig);
var keyDateFormat = 'setting_date_format';
var keyCalendarType = 'setting_calendar_type';
var dateFormatList = {
  'dd MMMM yyyy': 'DD MMMM YYYY',
  'dd-MMM-yyyy': 'DD-MMM-YYYY',
  'dd-MMM-yy': 'DD-MMM-YY',
  'yyyy-MM-dd': 'YYYY-MM-DD',
  'MM/dd/yyyy': 'MM/DD/YYYY',
  'dd/MM/yyyy': 'DD/MM/YYYY',
  'dd/MM/yy': 'DD/MM/YY',
  'MMM dd, yyyy': 'MMM DD, YYYY'
};
var dateTimeFormatList = {
  'dd MMMM yyyy': 'DD MMMM YYYY HH:mm',
  'dd-MMM-yyyy': 'DD-MMM-YYYY HH:mm',
  'dd-MMM-yy': 'DD-MMM-YY HH:mm',
  'yyyy-MM-dd': 'YYYY-MM-DD HH:mm',
  'MM/dd/yyyy': 'MM/DD/YYYY HH:mm',
  'dd/MM/yyyy': 'DD/MM/YYYY HH:mm',
  'dd/MM/yy': 'DD/MM/YY HH:mm',
  'MMM dd, yyyy': 'MMM DD, YYYY HH:mm'
};
var getDateFormat = exports.getDateFormat = function getDateFormat(showTimeSelect) {
  var key = showTimeSelect ? dateTimeFormatList[localStorage.getItem(keyDateFormat)] : dateFormatList[localStorage.getItem(keyDateFormat)];
  return key || (showTimeSelect ? 'DD MMMM YYYY HH:mm' : 'DD MMMM YYYY');
};
var getCalendarType = exports.getCalendarType = function getCalendarType() {
  var key = localStorage.getItem(keyCalendarType);
  return key || 'EN';
};

// Helper: convert a dayjs format mask to Buddhist Era format safely
var toBuddhistFormat = function toBuddhistFormat(formatMask) {
  return formatMask.replace('YYYY', 'BBBB').replace(/(?<!B)YY(?![Y])/g, 'BB');
};
var DatePicker = /*#__PURE__*/function (_React$Component) {
  function DatePicker(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, DatePicker);
    _this = _callSuper(this, DatePicker, [props]);
    (0, _defineProperty2["default"])(_this, "checkForValue", function () {
      var attempt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var defaultValue = _this.props.defaultValue;
      var maxRetries = 3;
      if (!_this.state.value && defaultValue) {
        setTimeout(function () {
          if (_this.mounted && !_this.state.value) {
            var formatMask = _this.state.formatMask;
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
    (0, _defineProperty2["default"])(_this, "handleChange", function (date) {
      var formatMask = _this.state.formatMask;
      var calendarType = getCalendarType();
      var lockedDate = null;
      if (date) {
        var year = date.year();
        if (calendarType === 'TH' || calendarType !== 'EN') {
          if (year > 2500) {
            year = year - 543;
          }
        }
        var correctedDate = date.clone().year(year);
        lockedDate = correctedDate.format('YYYY-MM-DDTHH:mm:ss');
        lockedDate = (0, _dayjs2["default"])(lockedDate).toISOString();
      }
      console.log('Saved Date:', lockedDate);
      _this.setState({
        value: lockedDate,
        placeholder: formatMask.toLowerCase()
      });
    });
    (0, _defineProperty2["default"])(_this, "handleTimeChange", function (time) {
      var isoTime = time ? time.toISOString() : null;
      console.log('Saved Time (Real UTC Math):', isoTime);
      _this.setState({
        value: isoTime,
        placeholder: 'HH:mm'
      });
    });
    (0, _defineProperty2["default"])(_this, "formatDate", function (date, formatMask) {
      if (!date) return '';
      var localDate = (0, _dayjs2["default"])(date);
      if (getCalendarType() === 'EN') {
        return localDate.format(formatMask);
      } else {
        return localDate.format(toBuddhistFormat(formatMask));
      }
    });
    (0, _defineProperty2["default"])(_this, "getPickerFormat", function () {
      var formatMask = _this.state.formatMask;
      var calendarType = getCalendarType();
      return calendarType === 'EN' ? formatMask : toBuddhistFormat(formatMask);
    });
    _this.inputField = /*#__PURE__*/_react["default"].createRef();
    _this.mounted = false;
    var _DatePicker$updateFor = DatePicker.updateFormat(props, null),
      _formatMask = _DatePicker$updateFor.formatMask;
    _this.state = _objectSpread(_objectSpread({}, DatePicker.updateDateTime(props, _formatMask)), {}, {
      loading: true
    });
    return _this;
  }
  (0, _inherits2["default"])(DatePicker, _React$Component);
  return (0, _createClass2["default"])(DatePicker, [{
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
      var _this$props$data = this.props.data,
        showTimeSelect = _this$props$data.showTimeSelect,
        showTimeSelectOnly = _this$props$data.showTimeSelectOnly;
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var hasValue = this.state.value && this.state.value.toString().trim() !== '';
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
      }
      var tooltipText = savedEditor && savedEditor.name && hasValue ? "".concat(this.state.value ? this.formatDate(this.state.value, showTimeSelectOnly ? 'HH:mm' : this.state.formatMask) : '', "\nEdited by: ").concat(savedEditor.name) : '';
      var props = {
        type: 'date',
        className: 'form-control',
        name: this.props.data.field_name
      };
      if (tooltipText) {
        props.title = tooltipText;
      }
      var readOnly = this.props.data.readOnly || this.props.read_only || !isSameEditor;
      if (this.props.mutable) {
        props.defaultValue = this.props.defaultValue;
        props.ref = this.inputField;
      }
      var baseClasses = 'SortableItem rfb-item';
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      var calendarType = getCalendarType();
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group",
        title: tooltipText
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", null, readOnly ? /*#__PURE__*/_react["default"].createElement("input", {
        type: "text",
        name: props.name,
        ref: props.ref,
        readOnly: readOnly,
        placeholder: this.state.placeholder,
        value: this.state.value ? this.formatDate(this.state.value, showTimeSelectOnly ? 'HH:mm' : this.state.formatMask) : '',
        disabled: !isSameEditor,
        className: "form-control"
      }) : !showTimeSelectOnly ? calendarType === 'EN' ? /*#__PURE__*/_react["default"].createElement(_antd.DatePicker, {
        name: props.name,
        ref: props.ref,
        onChange: this.handleChange,
        value: this.state.value ? (0, _dayjs2["default"])(this.state.value) : null,
        className: "form-control bold-date-picker",
        format: this.getPickerFormat(),
        showTime: showTimeSelect ? {
          format: 'HH:mm',
          showSecond: false
        } : null,
        disabled: !isSameEditor || this.state.loading,
        placeholder: this.state.placeholder,
        getPopupContainer: function getPopupContainer() {
          return document.body;
        },
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
      }) : /*#__PURE__*/_react["default"].createElement(DatePickerTH, {
        name: props.name,
        ref: props.ref,
        onChange: this.handleChange,
        value: this.state.value ? (0, _dayjs2["default"])(this.state.value) : null,
        className: "form-control bold-date-picker",
        format: this.getPickerFormat(),
        showTime: showTimeSelect ? {
          format: 'HH:mm',
          showSecond: false
        } : null,
        disabled: !isSameEditor || this.state.loading,
        placeholder: this.state.placeholder,
        getPopupContainer: function getPopupContainer() {
          return document.body;
        },
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
      }) : /*#__PURE__*/_react["default"].createElement(_antd.TimePicker, {
        name: props.name,
        ref: props.ref,
        onChange: this.handleTimeChange,
        value: this.state.value ? (0, _dayjs2["default"])(this.state.value) : null,
        className: "form-control bold-time-picker",
        disabled: !isSameEditor || this.state.loading,
        placeholder: this.state.placeholder,
        getPopupContainer: function getPopupContainer() {
          return document.body;
        },
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
      var _props$data = props.data,
        defaultToday = _props$data.defaultToday,
        showTimeSelectOnly = _props$data.showTimeSelectOnly;
      var calendarType = getCalendarType();
      if (defaultToday && !props.defaultValue) {
        value = (0, _dayjs2["default"])().toISOString();
      } else if (props.defaultValue) {
        try {
          var parsedDate = (0, _dayjs2["default"])(props.defaultValue, formatMask);
          if (parsedDate.isValid()) {
            if (calendarType !== 'EN' && parsedDate.year() > 2500) {
              parsedDate = parsedDate.year(parsedDate.year() - 543);
            }
            value = parsedDate.toISOString();
          } else {
            var fallbackDate = (0, _dayjs2["default"])(props.defaultValue);
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
        value: value,
        placeholder: props.data.showTimeSelectOnly ? 'HH:mm' : formatMask.toLowerCase(),
        defaultToday: defaultToday,
        formatMask: formatMask,
        defaultValue: props.defaultValue
      };
    }
  }]);
}(_react["default"].Component);
var _default = exports["default"] = DatePicker;