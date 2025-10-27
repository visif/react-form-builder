"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _react = _interopRequireDefault(require("react"));
var _xss = _interopRequireDefault(require("xss"));
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); } /**
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
var FormValidator = exports["default"] = /*#__PURE__*/function (_React$Component) {
  function FormValidator(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, FormValidator);
    _this = _callSuper(this, FormValidator, [props]);
    _this.state = {
      errors: []
    };
    return _this;
  }
  (0, _inherits2["default"])(FormValidator, _React$Component);
  return (0, _createClass2["default"])(FormValidator, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;
      this.subscription = this.props.emitter.addListener('formValidation', function (errors) {
        _this2.setState({
          errors: errors
        });
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.subscription.remove();
    }
  }, {
    key: "dismissModal",
    value: function dismissModal(e) {
      e.preventDefault();
      this.setState({
        errors: []
      });
    }
  }, {
    key: "render",
    value: function render() {
      var errors = this.state.errors.map(function (error, index) {
        return /*#__PURE__*/_react["default"].createElement("li", {
          key: "error_".concat(index),
          dangerouslySetInnerHTML: {
            __html: myxss.process(error)
          }
        });
      });
      return /*#__PURE__*/_react["default"].createElement("div", null, this.state.errors.length > 0 && /*#__PURE__*/_react["default"].createElement("div", {
        className: "alert alert-danger validation-error"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "clearfix"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "fas fa-exclamation-triangle float-left"
      }), /*#__PURE__*/_react["default"].createElement("ul", {
        className: "float-left"
      }, errors)), /*#__PURE__*/_react["default"].createElement("div", {
        className: "clearfix"
      }, /*#__PURE__*/_react["default"].createElement("a", {
        className: "float-right btn btn-default btn-sm btn-danger",
        onClick: this.dismissModal.bind(this)
      }, "Dismiss"))));
    }
  }]);
}(_react["default"].Component);