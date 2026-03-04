"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
const PLACE_HOLDER = 'form-place-holder';
class PlaceHolder extends _react.default.Component {
  render() {
    const isEmpty = this.props.index === 0;
    return this.props.show && /*#__PURE__*/_react.default.createElement("div", {
      className: PLACE_HOLDER,
      style: {
        minHeight: isEmpty ? '100px' : '50px',
        opacity: isEmpty ? 1 : 0.5
      }
    }, /*#__PURE__*/_react.default.createElement("div", null, isEmpty ? this.props.text : 'Drop items here'));
  }
}
exports.default = PlaceHolder;
PlaceHolder.propTypes = {
  text: _propTypes.default.string,
  show: _propTypes.default.bool
};
PlaceHolder.defaultProps = {
  text: 'Dropzone',
  show: false
};