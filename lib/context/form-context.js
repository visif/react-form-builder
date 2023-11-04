"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFormContext = exports.FormProvider = exports.FORM_ACTION = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var FormContext = /*#__PURE__*/(0, _react.createContext)({
  formValues: {}
});
var FORM_ACTION = {
  UPDATE_VALUE: "UPDATE_VALUE"
};
exports.FORM_ACTION = FORM_ACTION;
var formReducer = function formReducer(state, action) {
  switch (action.type) {
    case FORM_ACTION.UPDATE_VALUE:
      return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, action.name, action.value));
    default:
      return state;
  }
};
var FormProvider = function FormProvider(_ref) {
  var children = _ref.children;
  var _useReducer = (0, _react.useReducer)(formReducer, {}),
    _useReducer2 = (0, _slicedToArray2["default"])(_useReducer, 2),
    formValues = _useReducer2[0],
    dispatch = _useReducer2[1];
  return /*#__PURE__*/_react["default"].createElement(FormContext.Provider, {
    value: {
      formValues: formValues,
      dispatch: dispatch
    }
  }, children);
};
exports.FormProvider = FormProvider;
var useFormContext = function useFormContext() {
  return (0, _react.useContext)(FormContext);
};
exports.useFormContext = useFormContext;