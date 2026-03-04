"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _reactDnd = require("react-dnd");
var _reactDom = require("react-dom");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _ItemTypes = _interopRequireDefault(require("./ItemTypes"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const cardStyle = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move'
};
const MULTI_COLUMN_ELEMENTS = new Set(['TwoColumnRow', 'ThreeColumnRow', 'FourColumnRow', 'DynamicColumnRow']);
const shouldUseDragHandle = props => {
  var _props$data, _props$data2;
  const element = (props === null || props === void 0 || (_props$data = props.data) === null || _props$data === void 0 ? void 0 : _props$data.element) || (props === null || props === void 0 || (_props$data2 = props.data) === null || _props$data2 === void 0 ? void 0 : _props$data2.key);
  if (MULTI_COLUMN_ELEMENTS.has(element)) return true;
  return false;
};

// Drag source specification
const cardSource = {
  beginDrag(props) {
    return {
      itemType: _ItemTypes.default.CARD,
      id: props.id,
      index: props.index,
      // Include data and methods needed for dropping into multi-column cells
      data: props.data,
      // For already-dropped items, onCreate should just return the item itself
      onCreate: props.onCreate || (item => item),
      setAsChild: props.setAsChild,
      getDataById: props.getDataById
    };
  }
};

// Drop target specification
const cardTarget = {
  drop(props, monitor, component) {
    if (!component) return;

    // If the drop was already handled by a nested target (e.g., multi-column), don't process it again
    if (monitor.didDrop()) {
      return;
    }
    const item = monitor.getItem();
    const dragIndex = item.index;
    const hoverIndex = props.index;
    const originalIndex = item.originalIndex !== undefined ? item.originalIndex : dragIndex;
    if (item.itemType === _ItemTypes.default.CARD) {
      return;
    }

    // Handle dropping items that were in a multi-column (have parentId)
    if (item.data && item.data.parentId) {
      if (props.moveCardFromCell) {
        // Use the data.id as the source identifier to avoid relying on props.index,
        // which can be the parent row index when rendering child elements.
        const dragId = item.data.id;
        props.moveCardFromCell(dragId, hoverIndex, item.data.parentId, item.data.row, item.data.col);
      }
      return;
    }

    // Handle dropping items from toolbar (originalIndex === -1 means from toolbar)
    // IMPORTANT: Only process if item doesn't have parentId (not from a cell)
    if (originalIndex === -1 && item.data && !item.isInserted && !item.data.parentId) {
      let newItem;
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
  hover(props, monitor, component) {
    if (!component) return;
    const item = monitor.getItem();
    const dragIndex = item.index;
    const hoverIndex = props.index;
    const isContainerElement = item.data && MULTI_COLUMN_ELEMENTS.has(item.data.element);
    const isChildElement = item.data && item.data.parentId !== undefined;

    // Allow container rows to reorder at root level, but prevent nesting them into other containers
    if (item.data && typeof item.setAsChild === 'function') {
      if (isContainerElement && !isChildElement && dragIndex < 0) {
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
    let node;
    try {
      node = (0, _reactDom.findDOMNode)(component);
    } catch (err) {
      return;
    }
    if (!node) return;
    const hoverBoundingRect = node.getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
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
const withDragAndDrop = ComposedComponent => {
  class Card extends _react.Component {
    render() {
      const {
        isDragging,
        connectDragSource,
        connectDropTarget
      } = this.props;
      const opacity = isDragging ? 0 : 1;
      const useDragHandle = this.props.useDragHandle || shouldUseDragHandle(this.props);
      const content = /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(ComposedComponent, (0, _extends2.default)({}, this.props, {
        style: _objectSpread(_objectSpread({}, cardStyle), {}, {
          opacity
        })
      })));
      return useDragHandle ? connectDropTarget(content) : connectDragSource(connectDropTarget(content));
    }
  }
  (0, _defineProperty2.default)(Card, "propTypes", {
    connectDragSource: _propTypes.default.func.isRequired,
    connectDropTarget: _propTypes.default.func.isRequired,
    index: _propTypes.default.number.isRequired,
    isDragging: _propTypes.default.bool,
    id: _propTypes.default.any.isRequired,
    moveCard: _propTypes.default.func.isRequired,
    moveCardFromCell: _propTypes.default.func,
    seq: _propTypes.default.number
  });
  (0, _defineProperty2.default)(Card, "defaultProps", {
    seq: -1
  });
  const DroppableCard = (0, _reactDnd.DropTarget)([_ItemTypes.default.CARD, _ItemTypes.default.BOX], cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  }))(Card);
  return (0, _reactDnd.DragSource)(_ItemTypes.default.CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))(DroppableCard);
};
var _default = exports.default = withDragAndDrop;