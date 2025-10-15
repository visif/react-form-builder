"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = debounce;
// Simple debounce utility with cancel support
// Usage: const debouncedFn = debounce(fn, 100)
// debouncedFn.cancel() to clear pending invocation
function debounce(fn) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var timeoutId = null;
  function debounced() {
    var _this = this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      timeoutId = null;
      fn.apply(_this, args); // eslint-disable-line prefer-rest-params
    }, wait);
  }
  debounced.cancel = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  return debounced;
}