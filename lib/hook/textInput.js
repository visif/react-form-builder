"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var delay = 500;
function useDebounce(props) {
  var value = props.value;
  var _useState = (0, _react.useState)(value),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    debouncedValue = _useState2[0],
    setDebouncedValue = _useState2[1];
  (0, _react.useEffect)(function () {
    var handler = setTimeout(function () {
      setDebouncedValue(value);
    }, delay);

    // Cleanup the timeout on each value change
    return function () {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
function DebouncedInput(props) {
  var id = props.id,
    style = props.style,
    value = props.value,
    onChange = props.onChange;
  var _useState3 = (0, _react.useState)(value),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    inputValue = _useState4[0],
    setInputValue = _useState4[1];
  var debouncedValue = useDebounce({
    value: inputValue
  });
  var handleChange = function handleChange(e) {
    setInputValue(e.target.value);
  };
  (0, _react.useEffect)(function () {
    onChange(debouncedValue);
  }, [debouncedValue]);
  return /*#__PURE__*/_react["default"].createElement("input", {
    id: id,
    type: "text",
    className: "form-control",
    style: style,
    value: inputValue,
    onChange: handleChange
  });
}
var _default = DebouncedInput;
exports["default"] = _default;