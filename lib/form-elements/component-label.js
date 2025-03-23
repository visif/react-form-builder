"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _myxss = _interopRequireDefault(require("./myxss"));
var ComponentLabel = function ComponentLabel(props) {
  var hasRequiredLabel = props.data.hasOwnProperty('required') && props.data.required === true && !props.read_only;
<<<<<<< HEAD
  var labelText = _myxss.default.process(props.data.label);
  return /*#__PURE__*/_react.default.createElement("label", {
=======
  var labelText = _myxss["default"].process(props.data.label);
  if (props.data.formularKey) {
    labelText = "".concat(labelText, " (").concat(props.data.formularKey, ")");
  }
  return /*#__PURE__*/_react["default"].createElement("label", {
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
    className: props.className || ''
  }, /*#__PURE__*/_react.default.createElement("span", {
    dangerouslySetInnerHTML: {
      __html: labelText
    }
  }), hasRequiredLabel && /*#__PURE__*/_react.default.createElement("span", {
    className: "label-required badge badge-danger"
  }, "Required"));
};
var _default = ComponentLabel;
exports.default = _default;