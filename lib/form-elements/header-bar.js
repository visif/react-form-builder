"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _grip = _interopRequireDefault(require("../multi-column/grip"));
/**
 * <HeaderBar />
 */

class HeaderBar extends _react.default.Component {
  render() {
    var _this$props$editModeO, _this$props$onDestroy;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "toolbar-header"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "badge badge-secondary"
    }, this.props.data.text), /*#__PURE__*/_react.default.createElement("div", {
      className: "toolbar-header-buttons"
    }, this.props.data.element !== 'LineBreak' && /*#__PURE__*/_react.default.createElement("div", {
      className: "btn is-isolated",
      onClick: (_this$props$editModeO = this.props.editModeOn) === null || _this$props$editModeO === void 0 ? void 0 : _this$props$editModeO.bind(this.props.parent, this.props.data)
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "is-isolated fas fa-edit"
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "btn is-isolated",
      onClick: (_this$props$onDestroy = this.props.onDestroy) === null || _this$props$onDestroy === void 0 ? void 0 : _this$props$onDestroy.bind(this, this.props.data)
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "is-isolated fas fa-trash"
    })), !this.props.data.isContainer && /*#__PURE__*/_react.default.createElement(_grip.default, {
      data: this.props.data,
      index: this.props.index,
      onDestroy: this.props.onDestroy,
      setAsChild: this.props.setAsChild
    })));
  }
}
exports.default = HeaderBar;