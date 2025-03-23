"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _react = _interopRequireDefault(require("react"));
var _grip = _interopRequireDefault(require("../multi-column/grip"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var HeaderBar = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(HeaderBar, _React$Component);
  var _super = _createSuper(HeaderBar);
  function HeaderBar() {
    (0, _classCallCheck2.default)(this, HeaderBar);
    return _super.apply(this, arguments);
  }
  (0, _createClass2.default)(HeaderBar, [{
    key: "render",
    value: function render() {
      var _this$props$editModeO, _this$props$onDestroy;
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "toolbar-header"
      }, /*#__PURE__*/_react.default.createElement("span", {
        className: "badge badge-secondary"
      }, this.props.data.text), /*#__PURE__*/_react.default.createElement("div", {
        className: "toolbar-header-buttons"
<<<<<<< HEAD
      }, this.props.data.element !== 'LineBreak' && /*#__PURE__*/_react.default.createElement("div", {
=======
      }, this.props.data.element !== 'LineBreak' && /*#__PURE__*/_react["default"].createElement("div", {
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
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
  }]);
  return HeaderBar;
}(_react.default.Component);
exports.default = HeaderBar;