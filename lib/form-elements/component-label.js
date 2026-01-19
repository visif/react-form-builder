"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _myxss = _interopRequireDefault(require("./myxss"));
var ComponentLabel = function ComponentLabel(props) {
  // Don't render anything if either isShowLabel is false or hideLabel is true
  if (props.data.isShowLabel !== undefined && props.data.isShowLabel === false || props.data && props.data.hideLabel === true) {
    return null;
  }

  // Hide label in preview if element is in a DynamicColumnRow, but not other column types
  if (props.data.parentId) {
    // Try to find the parent element via props.mutable
    var parentElement = props.mutable && props.mutable.getDataById && props.mutable.getDataById(props.data.parentId);

    // If parent exists and is specifically a DynamicColumnRow, don't show label unless displayLabelInColumn is true
    if (parentElement && parentElement.element === 'DynamicColumnRow' && props.data.displayLabelInColumn !== true) {
      return null;
    }

    // For other column types (Two, Three, Four Column Row), we DO want to show the label
  }

  var hasRequiredLabel = props.data.hasOwnProperty('required') && props.data.required === true && !props.read_only;
  var labelText = _myxss.default.process(props.data.label);
  if (props.data.formularKey && props.preview) {
    labelText = "".concat(labelText, " (").concat(props.data.formularKey, ")");
  }
  return /*#__PURE__*/_react.default.createElement("label", {
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