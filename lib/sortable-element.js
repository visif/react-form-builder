"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _reactDnd = require("react-dnd");
var _reactDom = require("react-dom");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _ItemTypes = _interopRequireDefault(require("./ItemTypes"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var cardStyle = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move'
};

// Drag source specification
var cardSource = {
  beginDrag: function beginDrag(props) {
    return {
      itemType: _ItemTypes["default"].CARD,
      id: props.id,
      index: props.index
    };
  }
};

// Drop target specification
var cardTarget = {
  drop: function drop(props, monitor, component) {
    if (!component) return;
    var item = monitor.getItem();
    var dragIndex = item.index;
    var hoverIndex = props.index;
    if (props.data.isContainer || item.itemType === _ItemTypes["default"].CARD) {
      return;
    }
    if (item.data && typeof item.setAsChild === 'function' && dragIndex === -1) {
      props.insertCard(item, hoverIndex, item.id);
    }
  },
  hover: function hover(props, monitor, component) {
    var item = monitor.getItem();
    var dragIndex = item.index;
    var hoverIndex = props.index;
    if (item.data && typeof item.setAsChild === 'function') {
      return;
    }
    if (dragIndex === hoverIndex) {
      return;
    }
    if (dragIndex === -1) {
      if (props.data && props.data.isContainer) {
        return;
      }
      item.index = hoverIndex;
      props.insertCard(item.onCreate(item.data), hoverIndex);
    }
    var hoverBoundingRect = (0, _reactDom.findDOMNode)(component).getBoundingClientRect();
    var hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    var clientOffset = monitor.getClientOffset();
    var hoverClientY = clientOffset.y - hoverBoundingRect.top;
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }
    props.moveCard(dragIndex, hoverIndex);
    item.index = hoverIndex;
  }
};
var withDragAndDrop = function withDragAndDrop(ComposedComponent) {
  var Card = /*#__PURE__*/function (_Component) {
    function Card() {
      (0, _classCallCheck2["default"])(this, Card);
      return _callSuper(this, Card, arguments);
    }
    (0, _inherits2["default"])(Card, _Component);
    return (0, _createClass2["default"])(Card, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
          isDragging = _this$props.isDragging,
          connectDragSource = _this$props.connectDragSource,
          connectDropTarget = _this$props.connectDropTarget;
        var opacity = isDragging ? 0 : 1;
        return connectDragSource(connectDropTarget(/*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(ComposedComponent, (0, _extends2["default"])({}, this.props, {
          style: _objectSpread(_objectSpread({}, cardStyle), {}, {
            opacity: opacity
          })
        })))));
      }
    }]);
  }(_react.Component);
  (0, _defineProperty2["default"])(Card, "propTypes", {
    connectDragSource: _propTypes["default"].func.isRequired,
    connectDropTarget: _propTypes["default"].func.isRequired,
    index: _propTypes["default"].number.isRequired,
    isDragging: _propTypes["default"].bool,
    id: _propTypes["default"].any.isRequired,
    moveCard: _propTypes["default"].func.isRequired,
    seq: _propTypes["default"].number
  });
  (0, _defineProperty2["default"])(Card, "defaultProps", {
    seq: -1
  });
  var DroppableCard = (0, _reactDnd.DropTarget)([_ItemTypes["default"].CARD, _ItemTypes["default"].BOX], cardTarget, function (connect) {
    return {
      connectDropTarget: connect.dropTarget()
    };
  })(Card);
  return (0, _reactDnd.DragSource)(_ItemTypes["default"].CARD, cardSource, function (connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    };
  })(DroppableCard);
};
var _default = exports["default"] = withDragAndDrop;