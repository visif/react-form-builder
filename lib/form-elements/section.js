"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
class Section extends _react.default.Component {
  render() {
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses,
      id: this.props.data.header
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("h5", null, this.props.data.header), /*#__PURE__*/_react.default.createElement("hr", null));
  }
}
exports.default = Section;