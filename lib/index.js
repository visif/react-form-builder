"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactDnd = require("react-dnd");
var _reactDndHtml5Backend = require("react-dnd-html5-backend");
var ReactFormBuilder = function ReactFormBuilder() {
  return /*#__PURE__*/_react["default"].createElement(_reactDnd.DndProvider, {
    backend: _reactDndHtml5Backend.HTML5Backend
  }, "TESTTTTTTT");
};
var FormBuilders = {};
FormBuilders.ReactFormBuilder = ReactFormBuilder;
var _default = FormBuilders;
exports["default"] = _default;