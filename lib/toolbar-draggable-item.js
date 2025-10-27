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
var _reactDnd = require("react-dnd");
var _ItemTypes = _interopRequireDefault(require("./ItemTypes"));
var _UUID = _interopRequireDefault(require("./UUID"));
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); } /**
 * <ToolbarItem />
 */
var cardSource = {
  beginDrag: function beginDrag(props) {
    return {
      id: _UUID["default"].uuid(),
      index: -1,
      data: props.data,
      onCreate: props.onCreate
    };
  }
};
var ToolbarItem = /*#__PURE__*/function (_React$Component) {
  function ToolbarItem() {
    (0, _classCallCheck2["default"])(this, ToolbarItem);
    return _callSuper(this, ToolbarItem, arguments);
  }
  (0, _inherits2["default"])(ToolbarItem, _React$Component);
  return (0, _createClass2["default"])(ToolbarItem, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
        connectDragSource = _this$props.connectDragSource,
        data = _this$props.data,
        onClick = _this$props.onClick;
      if (!connectDragSource) return null;
      return connectDragSource(/*#__PURE__*/_react["default"].createElement("li", {
        onClick: onClick
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: data.icon
      }), data.name));
    }
  }]);
}(_react["default"].Component);
var _default = exports["default"] = (0, _reactDnd.DragSource)(_ItemTypes["default"].CARD, cardSource, function (connect) {
  return {
    connectDragSource: connect.dragSource()
  };
})(ToolbarItem);