"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
class CustomElement extends _react.Component {
  constructor(props) {
    super(props);
    this.inputField = /*#__PURE__*/_react.default.createRef();
  }
  render() {
    const {
      bare
    } = this.props.data;
    const props = {};
    props.name = this.props.data.field_name;
    props.defaultValue = this.props.defaultValue;
    if (this.props.mutable && this.props.data.forwardRef) {
      props.ref = this.inputField;
    }
    if (this.props.read_only) {
      props.disabled = 'disabled';
    }

    // Return if component is invalid.
    if (!this.props.data.component) return null;
    const Element = this.props.data.component;
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), bare ? /*#__PURE__*/_react.default.createElement(Element, (0, _extends2.default)({
      data: this.props.data
    }, this.props.data.props, props)) : /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement(_componentLabel.default, (0, _extends2.default)({
      className: "form-label"
    }, this.props)), /*#__PURE__*/_react.default.createElement(Element, (0, _extends2.default)({
      data: this.props.data
    }, this.props.data.props, props))));
  }
}
CustomElement.propTypes = {};
var _default = exports.default = CustomElement;