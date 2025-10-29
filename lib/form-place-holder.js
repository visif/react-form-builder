"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var PLACE_HOLDER = 'form-place-holder';
var PlaceHolder = function PlaceHolder(_ref) {
  var _ref$text = _ref.text,
    text = _ref$text === void 0 ? 'Dropzone' : _ref$text,
    _ref$show = _ref.show,
    show = _ref$show === void 0 ? false : _ref$show;
  return show && /*#__PURE__*/_react["default"].createElement("div", {
    className: PLACE_HOLDER
  }, /*#__PURE__*/_react["default"].createElement("div", null, text));
};
PlaceHolder.propTypes = {
  text: _propTypes["default"].string,
  show: _propTypes["default"].bool
};
var _default = exports["default"] = PlaceHolder;