"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _icons = require("@ant-design/icons");
const deleteButtonStyle = {
  cursor: 'pointer',
  color: '#ff4d4f',
  background: 'transparent',
  border: 'none',
  padding: 4,
  lineHeight: 1,
  fontSize: 16,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};
const iconStyle = {
  fontSize: 16
};
const FormDeleteButton = _ref => {
  let {
    title,
    onClick
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    title: title,
    "aria-label": title,
    style: deleteButtonStyle,
    onClick: onClick
  }, /*#__PURE__*/_react.default.createElement(_icons.DeleteOutlined, {
    style: iconStyle
  }));
};
var _default = exports.default = FormDeleteButton;