"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = require("react-dom");

var _reactDnd = require("react-dnd");

var _ItemTypes = _interopRequireDefault(require("./ItemTypes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move'
};
var cardSource = {
  beginDrag: function beginDrag(props) {
    return {
      itemType: _ItemTypes["default"].CARD,
      id: props.id,
      index: props.index
    };
  }
};
var cardTarget = {
  drop: function drop(props, monitor, component) {
    if (!component) {
      return;
    }

    var item = monitor.getItem();
    var dragIndex = item.index;
    var hoverIndex = props.index;

    if (props.data.isContainer || item.itemType === _ItemTypes["default"].CARD) {
      // console.log('cardTarget -  Drop', item.itemType);
      return;
    }

    if (item.data && typeof item.setAsChild === 'function') {
      // console.log('BOX', item);
      if (dragIndex === -1) {
        props.insertCard(item, hoverIndex, item.id);
      }
    }
  },
  hover: function hover(props, monitor, component) {
    var item = monitor.getItem();
    var dragIndex = item.index;
    var hoverIndex = props.index;

    if (item.data && typeof item.setAsChild === 'function') {
      // console.log('BOX', item);
      return; // if (dragIndex === -1) {
      //   props.insertCard(item, hoverIndex, item.id);
      //   if (item.parentIndex === hoverIndex) {
      //     return;
      //   }
      // }
    } // Don't replace items with themselves


    if (dragIndex === hoverIndex) {
      return;
    }

    if (dragIndex === -1) {
      if (props.data && props.data.isContainer) {
        return;
      } // console.log('CARD', item);


      item.index = hoverIndex;
      props.insertCard(item.onCreate(item.data), hoverIndex);
    } // Determine rectangle on screen


    var hoverBoundingRect = (0, _reactDom.findDOMNode)(component).getBoundingClientRect(); // Get vertical middle

    var hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2; // Determine mouse position

    var clientOffset = monitor.getClientOffset(); // Get pixels to the top

    var hoverClientY = clientOffset.y - hoverBoundingRect.top; // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%
    // Dragging downwards

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    } // Dragging upwards


    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    } // Time to actually perform the action


    props.moveCard(dragIndex, hoverIndex); // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.

    item.index = hoverIndex;
  }
}; // eslint-disable-next-line no-unused-vars

function _default(ComposedComponent) {
  var Card = /*#__PURE__*/function (_Component) {
    _inherits(Card, _Component);

    var _super = _createSuper(Card);

    function Card() {
      _classCallCheck(this, Card);

      return _super.apply(this, arguments);
    }

    _createClass(Card, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            isDragging = _this$props.isDragging,
            connectDragSource = _this$props.connectDragSource,
            connectDropTarget = _this$props.connectDropTarget;
        var opacity = isDragging ? 0 : 1;
        return connectDragSource(connectDropTarget( /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(ComposedComponent, _extends({}, this.props, {
          style: _objectSpread(_objectSpread({}, style), {}, {
            opacity: opacity
          })
        })))));
      }
    }]);

    return Card;
  }(_react.Component);

  _defineProperty(Card, "propTypes", {
    connectDragSource: _propTypes["default"].func,
    connectDropTarget: _propTypes["default"].func,
    index: _propTypes["default"].number.isRequired,
    isDragging: _propTypes["default"].bool,
    id: _propTypes["default"].any.isRequired,
    // text: PropTypes.string.isRequired,
    moveCard: _propTypes["default"].func.isRequired,
    seq: _propTypes["default"].number
  });

  _defineProperty(Card, "defaultProps", {
    seq: -1
  });

  var x = (0, _reactDnd.DropTarget)([_ItemTypes["default"].CARD, _ItemTypes["default"].BOX], cardTarget, function (connect) {
    return {
      connectDropTarget: connect.dropTarget()
    };
  })(Card);
  return (0, _reactDnd.DragSource)(_ItemTypes["default"].CARD, cardSource, function (connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    };
  })(x);
}