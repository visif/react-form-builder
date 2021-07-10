"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _xss = _interopRequireDefault(require("xss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

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

var FormValidator = /*#__PURE__*/function (_React$Component) {
  _inherits(FormValidator, _React$Component);

  var _super = _createSuper(FormValidator);

  function FormValidator(props) {
    var _this;

    _classCallCheck(this, FormValidator);

    _this = _super.call(this, props);
    _this.state = {
      errors: []
    };
    return _this;
  }

  _createClass(FormValidator, [{
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

  return FormValidator;
}(_react["default"].Component);

exports["default"] = FormValidator;