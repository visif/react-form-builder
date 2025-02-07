"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDateFormat = exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
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
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var keyDateFormat = "setting_date_format";
var dateFormatList = {
  "dd MMMM yyyy": "DD MMMM YYYY",
  //"DD MMMM yyyy",
  "dd-MMM-yyyy": "DD-MMM-YYYY",
  "dd-MMM-yy": "DD-MMM-YY",
  "yyyy-MM-dd": "YYYY-MM-DD",
  "MM/dd/yyyy": "MM/DD/YYYY",
  //"MM/DD/yyyy",
  "dd/MM/yyyy": "DD/MM/YYYY",
  //"DD/MM/yyyy",
  "MMM dd, yyyy": "MMM DD, YYYY" //"MMM DD, yyyy"
};

var getDateFormat = function getDateFormat() {
  var key = dateFormatList[localStorage.getItem(keyDateFormat)];
  if (!key) {
    return "DD MMMM YYYY";
  } else return key;
};
exports.getDateFormat = getDateFormat;
var DatePicker = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(DatePicker, _React$Component);
  var _super = _createSuper(DatePicker);
  function DatePicker(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, DatePicker);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleChange", function (date) {
      var formatMask = _this.state.formatMask;
      var isoDate = date ? date.toISOString() : null;
      _this.setState({
        value: isoDate,
        placeholder: formatMask.toLowerCase()
      });
    });
    _this.inputField = /*#__PURE__*/_react["default"].createRef();
    var _DatePicker$updateFor = DatePicker.updateFormat(props, null),
      _formatMask = _DatePicker$updateFor.formatMask;
    _this.state = DatePicker.updateDateTime(props, _formatMask);
    return _this;
  }
  (0, _createClass2["default"])(DatePicker, [{
    key: "render",
    value: function render() {
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId;
      }
      var showTimeSelect = this.props.data.showTimeSelect;
      var props = {};
      props.type = "date";
      props.className = "form-control";
      props.name = this.props.data.field_name;
      var readOnly = this.props.data.readOnly || this.props.read_only || !isSameEditor;
      if (this.props.mutable) {
        props.defaultValue = this.props.defaultValue;
        props.ref = this.inputField;
      }
      var baseClasses = "SortableItem rfb-item";
      if (this.props.data.pageBreakBefore) {
        baseClasses += " alwaysbreak";
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", null, readOnly && /*#__PURE__*/_react["default"].createElement("input", {
        type: "text",
        name: props.name,
        ref: props.ref,
        readOnly: readOnly,
        placeholder: this.state.placeholder,
        value: this.state.value ? (0, _dayjs["default"])(this.state.value).format(this.state.formatMask) : "",
        disabled: !isSameEditor,
        className: "form-control"
      }), !readOnly && /*#__PURE__*/_react["default"].createElement(_antd.DatePicker, {
        name: props.name,
        ref: props.ref,
        onChange: this.handleChange,
        value: !!this.state.value ? (0, _dayjs["default"])(this.state.value) : null,
        className: "form-control",
        format: this.state.formatMask,
        showTime: showTimeSelect,
        disabled: !isSameEditor,
        placeholder: this.state.placeholder,
        style: {
          display: "inline-block",
          width: "auto"
        }
      }))));
    }
  }], [{
    key: "updateFormat",
    value: function updateFormat(props, oldFormatMask) {
      var formatMask = getDateFormat() || "DD MMMM YYYY";
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
        value = (0, _dayjs["default"])().toISOString;
      } else {
        if (props.defaultValue) {
          var isMMDDYYYY = /^\d{2}\/\d{2}\/\d{4}$/.test(props.defaultValue);
          value = (0, _dayjs["default"])(props.defaultValue, isMMDDYYYY ? "MM/DD/YYYY" : undefined).toISOString();
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
}(_react["default"].Component);
(0, _defineProperty2["default"])(DatePicker, "getDerivedStateFromProps", /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(props, state) {
    var _DatePicker$updateFor2, formatMask;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (props.defaultValue && props.defaultValue !== state.defaultValue) {
            _DatePicker$updateFor2 = DatePicker.updateFormat(props, null), formatMask = _DatePicker$updateFor2.formatMask;
            DatePicker.state = DatePicker.updateDateTime(props, formatMask);
          }
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var _default = DatePicker;
exports["default"] = _default;