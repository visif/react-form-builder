"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _xss = _interopRequireDefault(require("xss"));
require("./styles/validation-error.css");
/**
 * <FormValidator />
 */

const myxss = new _xss.default.FilterXSS({
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
class FormValidator extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: []
    };
  }
  componentDidMount() {
    this.subscription = this.props.emitter.addListener('formValidation', errors => {
      this.setState({
        errors
      });
    });
  }
  componentWillUnmount() {
    this.subscription.remove();
  }
  dismissModal(e) {
    e.preventDefault();
    this.setState({
      errors: []
    });
  }
  render() {
    const errors = this.state.errors.map((error, index) => /*#__PURE__*/_react.default.createElement("li", {
      key: "error_".concat(index),
      dangerouslySetInnerHTML: {
        __html: myxss.process(error)
      }
    }));
    return /*#__PURE__*/_react.default.createElement("div", null, this.state.errors.length > 0 && /*#__PURE__*/_react.default.createElement("div", {
      className: "alert alert-danger validation-error"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "clearfix"
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "fas fa-exclamation-triangle float-left"
    }), /*#__PURE__*/_react.default.createElement("ul", {
      className: "float-left"
    }, errors)), /*#__PURE__*/_react.default.createElement("div", {
      className: "clearfix"
    }, /*#__PURE__*/_react.default.createElement("a", {
      className: "float-right btn btn-default btn-sm btn-danger",
      onClick: this.dismissModal.bind(this)
    }, "Dismiss"))));
  }
}
exports.default = FormValidator;