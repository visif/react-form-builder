"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _grip = _interopRequireDefault(require("../multi-column/grip"));
/**
 * <HeaderBar />
 */

var HeaderBar = function HeaderBar(props) {
  var _props$editModeOn, _props$onDestroy;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "toolbar-header"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "badge badge-secondary"
  }, props.data.text), /*#__PURE__*/_react["default"].createElement("div", {
    className: "toolbar-header-buttons"
  }, props.data.element !== 'LineBreak' && /*#__PURE__*/_react["default"].createElement("div", {
    className: "btn is-isolated",
    onClick: (_props$editModeOn = props.editModeOn) === null || _props$editModeOn === void 0 ? void 0 : _props$editModeOn.bind(props.parent, props.data)
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "is-isolated fas fa-edit"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "btn is-isolated",
    onClick: (_props$onDestroy = props.onDestroy) === null || _props$onDestroy === void 0 ? void 0 : _props$onDestroy.bind(null, props.data)
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "is-isolated fas fa-trash"
  })), !props.data.isContainer && /*#__PURE__*/_react["default"].createElement(_grip["default"], {
    data: props.data,
    index: props.index,
    onDestroy: props.onDestroy,
    setAsChild: props.setAsChild
  })));
};
HeaderBar.propTypes = {
  data: _propTypes["default"].shape({
    text: _propTypes["default"].string,
    element: _propTypes["default"].string,
    isContainer: _propTypes["default"].bool
  }).isRequired,
  editModeOn: _propTypes["default"].func,
  onDestroy: _propTypes["default"].func,
  parent: _propTypes["default"].object,
  index: _propTypes["default"].number,
  setAsChild: _propTypes["default"].func
};
var _default = exports["default"] = HeaderBar;