"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _myxss = _interopRequireDefault(require("./myxss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ComponentLabel = function ComponentLabel(props) {
  var hasRequiredLabel = props.data.hasOwnProperty('required') && props.data.required === true && !props.read_only;

  var labelText = _myxss["default"].process(props.data.label);

  return /*#__PURE__*/_react["default"].createElement("label", {
    className: props.className || ''
  }, /*#__PURE__*/_react["default"].createElement("span", {
    dangerouslySetInnerHTML: {
      __html: labelText
    }
  }), hasRequiredLabel && /*#__PURE__*/_react["default"].createElement("span", {
    className: "label-required badge badge-danger"
  }, "Required"));
};

var _default = ComponentLabel;
exports["default"] = _default;