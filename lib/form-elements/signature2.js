"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _reactSignatureCanvas = _interopRequireDefault(require("react-signature-canvas"));

var _componentHeader = _interopRequireDefault(require("./component-header"));

var _componentLabel = _interopRequireDefault(require("./component-label"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Signature2 = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(Signature2, _React$Component);

  var _super = _createSuper(Signature2);

  function Signature2(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, Signature2);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "clear", function () {
      if (_this.state.defaultValue) {
        _this.setState({
          defaultValue: ''
        });
      } else if (_this.canvas.current) {
        _this.canvas.current.clear();
      }
    });
    _this.state = {
      defaultValue: props.defaultValue
    };
    _this.inputField = /*#__PURE__*/_react["default"].createRef();
    _this.canvas = /*#__PURE__*/_react["default"].createRef();
    return _this;
  }

  (0, _createClass2["default"])(Signature2, [{
    key: "render",
    value: function render() {
      var defaultValue = this.state.defaultValue;
      var canClear = !!defaultValue;
      var props = {};
      props.type = 'hidden';
      props.name = this.props.data.field_name;

      if (this.props.mutable) {
        props.defaultValue = defaultValue;
        props.ref = this.inputField;
      }

      var pad_props = {}; // umd requires canvasProps={{ width: 400, height: 150 }}

      if (this.props.mutable) {
        pad_props.defaultValue = defaultValue;
        pad_props.ref = this.canvas;
        canClear = !this.props.read_only;
      }

      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      var sourceDataURL;

      if (defaultValue && defaultValue.length > 0) {
        sourceDataURL = "data:image/png;base64,".concat(defaultValue);
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), this.props.read_only === true || !!sourceDataURL ? /*#__PURE__*/_react["default"].createElement("img", {
        src: sourceDataURL
      }) : /*#__PURE__*/_react["default"].createElement(_reactSignatureCanvas["default"], pad_props), canClear && /*#__PURE__*/_react["default"].createElement("i", {
        className: "fas fa-times clear-signature",
        onClick: this.clear,
        title: "Clear Signature"
      }), /*#__PURE__*/_react["default"].createElement("input", props)));
    }
  }]);
  return Signature2;
}(_react["default"].Component);

exports["default"] = Signature2;