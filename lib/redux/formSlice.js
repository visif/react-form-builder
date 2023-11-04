"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.increment = exports["default"] = exports.decrement = void 0;
var _toolkit = require("@reduxjs/toolkit");
var formSlice = (0, _toolkit.createSlice)({
  name: "form",
  initialState: {
    count: 0
  },
  reducers: {
    increment: function increment(state) {
      state.count += 1;
    },
    decrement: function decrement(state) {
      state.count -= 1;
    }
  }
});
var _formSlice$actions = formSlice.actions,
  increment = _formSlice$actions.increment,
  decrement = _formSlice$actions.decrement;
exports.decrement = decrement;
exports.increment = increment;
var _default = formSlice.reducer;
exports["default"] = _default;