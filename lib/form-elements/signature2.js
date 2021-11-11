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

var _componentHeader = _interopRequireDefault(require("./component-header"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Signature2 = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(Signature2, _React$Component);

  var _super = _createSuper(Signature2);

  function Signature2(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, Signature2);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "clickToSign", function () {
      _this.setState({
        isSigned: !_this.state.isSigned
      });
    });
    _this.state = {
      isSigned: false
    };
    return _this;
  }

  (0, _createClass2["default"])(Signature2, [{
    key: "render",
    value: function render() {
      var props = {};
      props.name = this.props.data.field_name;
      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group",
        onClick: this.clickToSign
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          textAlign: 'center'
        }
      }, this.state.isSigned ? 'Already signed' : '(Click to sign)'), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          textAlign: 'center',
          marginTop: 8,
          marginBottom: 8
        }
      }, "__________________"), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          textAlign: 'center'
        }
      }, this.props.data.position || 'Placeholder Text')));
    }
  }]);
  return Signature2;
}(_react["default"].Component);

exports["default"] = Signature2;