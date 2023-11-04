"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _toolkit = require("@reduxjs/toolkit");
var _formSlice = _interopRequireDefault(require("./formSlice"));
var store = (0, _toolkit.configureStore)({
  reducer: {
    form: _formSlice["default"]
  }
});
var _default = store;
exports["default"] = _default;