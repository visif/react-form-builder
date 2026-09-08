"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = debounce;
// Simple debounce utility with cancel support
// Usage: const debouncedFn = debounce(fn, 100)
// debouncedFn.cancel() to clear pending invocation
function debounce(fn) {
  let wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let timeoutId = null;
  function debounced() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn.apply(this, args); // eslint-disable-line prefer-rest-params
    }, wait);
  }
  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  return debounced;
}