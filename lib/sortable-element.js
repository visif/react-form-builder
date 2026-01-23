"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _reactDnd = require("react-dnd");
var _reactDom = require("react-dom");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _ItemTypes = _interopRequireDefault(require("./ItemTypes"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var cardStyle = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move'
};
var MULTI_COLUMN_ELEMENTS = new Set(['TwoColumnRow', 'ThreeColumnRow', 'FourColumnRow', 'DynamicColumnRow']);
var shouldUseDragHandle = function shouldUseDragHandle(props) {
  var _props$data, _props$data2;
  var element = (props === null || props === void 0 ? void 0 : (_props$data = props.data) === null || _props$data === void 0 ? void 0 : _props$data.element) || (props === null || props === void 0 ? void 0 : (_props$data2 = props.data) === null || _props$data2 === void 0 ? void 0 : _props$data2.key);
  if (MULTI_COLUMN_ELEMENTS.has(element)) return true;
  return false;
};

// Drag source specification
var cardSource = {
  beginDrag: function beginDrag(props) {
    return {
      itemType: _ItemTypes.default.CARD,
      id: props.id,
      index: props.index
    };
  }
};

// Drop target specification
var cardTarget = {
  drop: function drop(props, monitor, component) {
    if (!component) return;

    // If the drop was already handled by a nested target (e.g., multi-column), don't process it again
    if (monitor.didDrop()) {
      return;
    }
    var item = monitor.getItem();
    var dragIndex = item.index;
    var hoverIndex = props.index;
    var originalIndex = item.originalIndex !== undefined ? item.originalIndex : dragIndex;
    if (item.itemType === _ItemTypes.default.CARD) {
      return;
    }

    // Handle dropping items that were in a multi-column (have setAsChild and parentId)
    if (item.data && item.data.parentId && typeof item.setAsChild === 'function') {
      // This item is being moved out of a multi-column container
      var parent = item.getDataById(item.data.parentId);
      if (parent && parent.childItems) {
        // Clear the child reference from the parent
        var row = item.data.row;
        var col = item.data.col;
        if (row !== undefined && col !== undefined && parent.childItems[row]) {
          parent.childItems[row][col] = null;
        }
      }

      // Clean up the child-specific properties
      delete item.data.parentId;
      delete item.data.parentIndex;
      delete item.data.row;
      delete item.data.col;
      delete item.data.hideLabel;

      // Insert the item into the main form at the drop position
      props.insertCard(item.data, hoverIndex);
      return;
    }

    // Handle dropping items from toolbar (originalIndex === -1 means from toolbar)
    if (originalIndex === -1 && item.data && !item.isInserted) {
      var newItem;
      if (item && typeof item.onCreate === 'function') {
        newItem = item.onCreate(item.data);
      } else if (item.data) {
        newItem = item.data;
      } else {
        newItem = item;
      }
      props.insertCard(newItem, hoverIndex);
      // Mark as inserted to prevent double insertion
      item.isInserted = true;
    }
    if (item.data && typeof item.setAsChild === 'function' && originalIndex === -1) {
      props.insertCard(item, hoverIndex, item.id);
    }
  },
  hover: function hover(props, monitor, component) {
    if (!component) return;
    var item = monitor.getItem();
    var dragIndex = item.index;
    var hoverIndex = props.index;

    // Only prevent hover for container elements (multi-column rows) themselves, not their children
    if (item.data && typeof item.setAsChild === 'function') {
      // Check if this is a child element being dragged out (has parentId) vs a container
      var isChildElement = item.data.parentId !== undefined;
      var isContainerElement = MULTI_COLUMN_ELEMENTS.has(item.data.element);

      // Allow children to be dragged out, but prevent containers from being nested
      if (isContainerElement && !isChildElement) {
        return;
      }
      // If it's a child element, allow the hover to continue for repositioning
    }

    if (dragIndex === hoverIndex) {
      return;
    }
    // Only update visual position during hover for items from toolbar, don't insert yet
    if (dragIndex === -1) {
      // Store the original index so we know it came from toolbar
      item.originalIndex = -1;
      item.index = hoverIndex;
      return;
    }
    var node;
    try {
      node = (0, _reactDom.findDOMNode)(component);
    } catch (err) {
      return;
    }
    if (!node) return;
    var hoverBoundingRect = node.getBoundingClientRect();
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
    (0, _inherits2.default)(Card, _Component);
    var _super = _createSuper(Card);
    function Card() {
      (0, _classCallCheck2.default)(this, Card);
      return _super.apply(this, arguments);
    }
    (0, _createClass2.default)(Card, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
          isDragging = _this$props.isDragging,
          connectDragSource = _this$props.connectDragSource,
          connectDropTarget = _this$props.connectDropTarget;
        var opacity = isDragging ? 0 : 1;
        var useDragHandle = this.props.useDragHandle || shouldUseDragHandle(this.props);
        var content = /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(ComposedComponent, (0, _extends2.default)({}, this.props, {
          style: _objectSpread(_objectSpread({}, cardStyle), {}, {
            opacity: opacity
          })
        })));
        return useDragHandle ? connectDropTarget(content) : connectDragSource(connectDropTarget(content));
      }
    }]);
    return Card;
  }(_react.Component);
  (0, _defineProperty2.default)(Card, "propTypes", {
    connectDragSource: _propTypes.default.func.isRequired,
    connectDropTarget: _propTypes.default.func.isRequired,
    index: _propTypes.default.number.isRequired,
    isDragging: _propTypes.default.bool,
    id: _propTypes.default.any.isRequired,
    moveCard: _propTypes.default.func.isRequired,
    seq: _propTypes.default.number
  });
  (0, _defineProperty2.default)(Card, "defaultProps", {
    seq: -1
  });
  var DroppableCard = (0, _reactDnd.DropTarget)([_ItemTypes.default.CARD, _ItemTypes.default.BOX], cardTarget, function (connect) {
    return {
      connectDropTarget: connect.dropTarget()
    };
  })(Card);
  return (0, _reactDnd.DragSource)(_ItemTypes.default.CARD, cardSource, function (connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    };
  })(DroppableCard);
};
var _default = withDragAndDrop;
exports.default = _default;