"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _componentHeader = _interopRequireDefault(require("./component-header"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var Signature2 = function Signature2(props) {
  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      isSigned = _useState2[0],
      setIsSigned = _useState2[1];

  var clickToSign = function clickToSign() {
    if (typeof props.getActiveUserProperties !== 'function') {
      return;
    }

    var userProperties = props.getActiveUserProperties();

    if (userProperties && ("".concat(userProperties.role).toLocaleLowerCase() === "".concat(props.data.position).toLocaleLowerCase() || "".concat(userProperties.name).toLocaleLowerCase() === "".concat(props.data.position).toLocaleLowerCase())) {
      setIsSigned(!isSigned);
    }
  };

  var baseClasses = 'SortableItem rfb-item';

  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }

  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group",
    onClick: clickToSign,
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/_react["default"].createElement("h5", {
    style: {
      textAlign: 'center'
    }
  }, isSigned ? 'Already signed' : '(Click to sign)'), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 8
    }
  }, "__________________"), /*#__PURE__*/_react["default"].createElement("h6", {
    style: {
      textAlign: 'center'
    }
  }, props.data.position || 'Placeholder Text')));
};

var _default = Signature2;
exports["default"] = _default;