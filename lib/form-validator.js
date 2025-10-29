"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _xss = _interopRequireDefault(require("xss"));
/**
 * <FormValidator />
 */

var myxss = new _xss["default"].FilterXSS({
  whiteList: {
    u: [],
    br: [],
    b: [],
    i: [],
    ol: ['style'],
    ul: ['style'],
    li: [],
    p: ['style'],
    sub: [],
    sup: [],
    div: ['style'],
    em: [],
    strong: [],
    span: ['style']
  }
});
var FormValidator = function FormValidator(props) {
  var _React$useState = _react["default"].useState([]),
    _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
    errors = _React$useState2[0],
    setErrors = _React$useState2[1];
  _react["default"].useEffect(function () {
    var subscription = props.emitter.addListener('formValidation', function (errors) {
      setErrors(errors);
    });
    return function () {
      subscription.remove();
    };
  }, [props.emitter]);
  var dismissModal = _react["default"].useCallback(function (e) {
    e.preventDefault();
    setErrors([]);
  }, []);
  var errorItems = errors.map(function (error, index) {
    return /*#__PURE__*/_react["default"].createElement("li", {
      key: "error_".concat(index),
      dangerouslySetInnerHTML: {
        __html: myxss.process(error)
      }
    });
  });
  return /*#__PURE__*/_react["default"].createElement("div", null, errors.length > 0 && /*#__PURE__*/_react["default"].createElement("div", {
    className: "alert alert-danger validation-error"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "clearfix"
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "fas fa-exclamation-triangle float-left"
  }), /*#__PURE__*/_react["default"].createElement("ul", {
    className: "float-left"
  }, errorItems)), /*#__PURE__*/_react["default"].createElement("div", {
    className: "clearfix"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    className: "float-right btn btn-default btn-sm btn-danger",
    onClick: dismissModal
  }, "Dismiss"))));
};
FormValidator.propTypes = {
  emitter: _propTypes["default"].shape({
    addListener: _propTypes["default"].func.isRequired
  }).isRequired
};
var _default = exports["default"] = FormValidator;