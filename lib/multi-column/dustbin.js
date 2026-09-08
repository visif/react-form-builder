"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _reactDnd = require("react-dnd");
var _formElements = _interopRequireDefault(require("../form-elements"));
var _customElement = _interopRequireDefault(require("../form-elements/custom-element"));
var _ItemTypes = _interopRequireDefault(require("../ItemTypes"));
var _registry = _interopRequireDefault(require("../stores/registry"));
const _excluded = ["greedy", "isOver", "isOverCurrent", "connectDropTarget", "items", "col", "row", "getDataById", "setAsChild", "syncColumnChanges", "updateElement"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
// Styles
const dustbinStyles = backgroundColor => ({
  border: '1px solid rgba(0,0,0,0.2)',
  minHeight: '2rem',
  width: '100%',
  backgroundColor,
  padding: 0,
  float: 'left'
});

// Helper Functions
const renderCustomElement = (item, props) => {
  if (!item.component || typeof item.component !== 'function') {
    item.component = _registry.default.get(item.key);
    if (!item.component) {
      console.error("".concat(item.element, " was not registered"));
    }
  }
  return /*#__PURE__*/_react.default.createElement(_customElement.default, (0, _extends2.default)({}, props, {
    mutable: false,
    key: "form_".concat(item.id),
    data: item
  }));
};
const renderElement = (item, props) => {
  if (!item) return null;
  const Element = item.custom ? () => renderCustomElement(item, props) : _formElements.default[item.element || item.key];

  // Add an onChange handler for column synchronization
  const elementProps = _objectSpread({}, props);

  // Check if this is a syncable element type
  if (['Checkboxes', 'RadioButtons', 'Dropdown', 'DataSource', 'Signature2', 'FormLink'].includes(item.element) && props.syncColumnChanges && props.editModeOn) {
    // Create an onElementChange handler for component-specific synchronization
    elementProps.onElementChange = changedData => {
      // Synchronize changes across the column
      props.syncColumnChanges(props.row, props.col, item.element, changedData);
    };
  }
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(Element, (0, _extends2.default)({}, elementProps, {
    key: "form_".concat(item.id),
    data: item
  })));
};
const isContainerItem = item => {
  if (item.itemType !== _ItemTypes.default.CARD) {
    const {
      data
    } = item;
    if (data) {
      return data.isContainer || data.field_name && data.field_name.includes('_col_row');
    }
  }
  return false;
};

// Main Component
const Dustbin = /*#__PURE__*/_react.default.forwardRef((_ref, ref) => {
  let {
      greedy,
      isOver,
      isOverCurrent,
      connectDropTarget,
      items,
      col,
      row,
      getDataById,
      setAsChild,
      syncColumnChanges,
      updateElement
    } = _ref,
    rest = (0, _objectWithoutProperties2.default)(_ref, _excluded);
  const item = getDataById(items[col]);

  // Handle drop operations
  (0, _react.useImperativeHandle)(ref, () => ({
    onDrop: dropped => {
      if (dropped.data && typeof setAsChild === 'function') {
        const isNew = !dropped.data.id;
        const data = isNew ? dropped.onCreate(dropped.data) : dropped.data;
        setAsChild(rest.data, data, row, col);
      }
    }
  }), [setAsChild, col, rest.data]);

  // Determine background color based on drag state
  const backgroundColor = isOverCurrent || isOver && greedy ? 'darkgreen' : 'rgba(0, 0, 0, .03)';
  const element = renderElement(item, _objectSpread(_objectSpread({}, rest), {}, {
    row,
    col,
    syncColumnChanges,
    updateElement
  }));
  return connectDropTarget(/*#__PURE__*/_react.default.createElement("div", {
    style: dustbinStyles(backgroundColor)
  }, element));
});

// Drop Target Configuration
const dropTargetSpec = {
  drop(props, monitor, component) {
    if (!component) return;
    const item = monitor.getItem();
    if (!isContainerItem(item)) {
      component.onDrop(item);
    }
  }
};
const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({
    shallow: true
  }),
  canDrop: monitor.canDrop()
});
var _default = exports.default = (0, _reactDnd.DropTarget)(props => props.accepts, dropTargetSpec, collect)(Dustbin);