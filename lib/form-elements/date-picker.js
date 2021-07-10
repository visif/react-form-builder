"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _dateFns = require("date-fns");

var _reactDatepicker = _interopRequireDefault(require("react-datepicker"));

var _componentHeader = _interopRequireDefault(require("./component-header"));

var _componentLabel = _interopRequireDefault(require("./component-label"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DatePicker = /*#__PURE__*/function (_React$Component) {
  _inherits(DatePicker, _React$Component);

  var _super = _createSuper(DatePicker);

  function DatePicker(props) {
    var _this;

    _classCallCheck(this, DatePicker);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "handleChange", function (dt) {
      var placeholder;
      var formatMask = _this.state.formatMask;

      if (dt && dt.target) {
        placeholder = dt && dt.target && dt.target.value === '' ? formatMask.toLowerCase() : '';
        var formattedDate = dt.target.value ? (0, _dateFns.format)(dt.target.value, formatMask) : '';

        _this.setState({
          value: formattedDate,
          internalValue: formattedDate,
          placeholder: placeholder
        });
      } else {
        _this.setState({
          value: dt ? (0, _dateFns.format)(dt, formatMask) : '',
          internalValue: dt,
          placeholder: placeholder
        });
      }
    });

    _this.inputField = /*#__PURE__*/_react["default"].createRef();

    var _DatePicker$updateFor = DatePicker.updateFormat(props, null),
        _formatMask = _DatePicker$updateFor.formatMask;

    _this.state = DatePicker.updateDateTime(props, {
      formatMask: _formatMask
    }, _formatMask);
    return _this;
  } // formatMask = '';


  _createClass(DatePicker, [{
    key: "render",
    value: function render() {
      var _this$props$data = this.props.data,
          showTimeSelect = _this$props$data.showTimeSelect,
          showTimeSelectOnly = _this$props$data.showTimeSelectOnly;
      var props = {};
      props.type = 'date';
      props.className = 'form-control';
      props.name = this.props.data.field_name;
      var readOnly = this.props.data.readOnly || this.props.read_only;
      var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      var placeholderText = this.state.formatMask.toLowerCase();

      if (this.props.mutable) {
        props.defaultValue = this.props.defaultValue;
        props.ref = this.inputField;
      }

      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
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
        value: this.state.value,
        className: "form-control"
      }), iOS && !readOnly && /*#__PURE__*/_react["default"].createElement("input", {
        type: "date",
        name: props.name,
        ref: props.ref,
        onChange: this.handleChange,
        dateFormat: "MM/DD/YYYY",
        placeholder: this.state.placeholder,
        value: this.state.value,
        className: "form-control"
      }), !iOS && !readOnly && /*#__PURE__*/_react["default"].createElement(_reactDatepicker["default"], {
        name: props.name,
        ref: props.ref,
        onChange: this.handleChange,
        selected: this.state.internalValue,
        todayButton: 'Today',
        className: "form-control",
        isClearable: true,
        showTimeSelect: showTimeSelect,
        showTimeSelectOnly: showTimeSelectOnly,
        dateFormat: this.state.formatMask,
        portalId: "root-portal",
        autoComplete: "off",
        placeholderText: placeholderText
      }))));
    }
  }], [{
    key: "updateFormat",
    value: function updateFormat(props, oldFormatMask) {
      var _props$data = props.data,
          showTimeSelect = _props$data.showTimeSelect,
          showTimeSelectOnly = _props$data.showTimeSelectOnly;
      var dateFormat = showTimeSelect && showTimeSelectOnly ? '' : props.data.dateFormat;
      var timeFormat = showTimeSelect ? props.data.timeFormat : '';
      var formatMask = "".concat(dateFormat, " ").concat(timeFormat).trim();
      var updated = formatMask !== oldFormatMask;
      return {
        updated: updated,
        formatMask: formatMask
      };
    }
  }, {
    key: "updateDateTime",
    value: function updateDateTime(props, state, formatMask) {
      var value;
      var internalValue;
      var defaultToday = props.data.defaultToday;

      if (defaultToday && (props.defaultValue === '' || props.defaultValue === undefined)) {
        value = (0, _dateFns.format)(new Date(), formatMask);
        internalValue = new Date();
      } else {
        value = props.defaultValue;

        if (value === '' || value === undefined) {
          internalValue = undefined;
        } else {
          internalValue = (0, _dateFns.parse)(value, state.formatMask, new Date());
        }
      }

      return {
        value: value,
        internalValue: internalValue,
        placeholder: formatMask.toLowerCase(),
        defaultToday: defaultToday,
        formatMask: state.formatMask
      };
    } // componentWillReceiveProps(props) {
    //   const formatUpdated = this.updateFormat(props);
    //   if ((props.data.defaultToday !== !this.state.defaultToday) || formatUpdated) {
    //     const state = this.updateDateTime(props, this.formatMask);
    //     this.setState(state);
    //   }
    // }

  }, {
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      var _DatePicker$updateFor2 = DatePicker.updateFormat(props, state.formatMask),
          updated = _DatePicker$updateFor2.updated,
          formatMask = _DatePicker$updateFor2.formatMask;

      if (props.data.defaultToday !== state.defaultToday || updated) {
        var newState = DatePicker.updateDateTime(props, state, formatMask);
        return newState;
      }

      return null;
    }
  }]);

  return DatePicker;
}(_react["default"].Component);

var _default = DatePicker;
exports["default"] = _default;