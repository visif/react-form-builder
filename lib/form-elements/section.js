"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var Section = function Section(props) {
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses,
    id: props.data.header
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("h5", null, props.data.header), /*#__PURE__*/_react["default"].createElement("hr", null));
};
Section.propTypes = {
  data: _propTypes["default"].shape({
    header: _propTypes["default"].string,
    isShowLabel: _propTypes["default"].bool,
    pageBreakBefore: _propTypes["default"].bool
  }).isRequired
};
var _default = exports["default"] = Section;