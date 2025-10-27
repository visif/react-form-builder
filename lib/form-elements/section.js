"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _react = _interopRequireDefault(require("react"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var Section = exports["default"] = /*#__PURE__*/function (_React$Component) {
  function Section() {
    (0, _classCallCheck2["default"])(this, Section);
    return _callSuper(this, Section, arguments);
  }
  (0, _inherits2["default"])(Section, _React$Component);
  return (0, _createClass2["default"])(Section, [{
    key: "render",
    value: function render() {
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses,
        id: this.props.data.header
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("h5", null, this.props.data.header), /*#__PURE__*/_react["default"].createElement("hr", null));
    }
  }]);
}(_react["default"].Component);