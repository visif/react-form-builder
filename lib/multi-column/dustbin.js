"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
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
var _excluded = ["greedy", "isOver", "isOverCurrent", "connectDropTarget", "items", "col", "row", "getDataById", "setAsChild", "syncColumnChanges", "updateElement"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
// Styles
var dustbinStyles = function dustbinStyles(backgroundColor) {
  return {
    border: '1px solid rgba(0,0,0,0.2)',
    minHeight: '2rem',
    minWidth: '12rem',
    width: '100%',
    backgroundColor: backgroundColor,
    padding: 0,
    float: 'left'
  };
};

// Helper Functions
var renderCustomElement = function renderCustomElement(item, props) {
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
var renderElement = function renderElement(item, props) {
  if (!item) return null;
  var Element = item.custom ? function () {
    return renderCustomElement(item, props);
  } : _formElements.default[item.element || item.key];

  // Add an onChange handler for column synchronization
  var elementProps = _objectSpread({}, props);

  // Check if this is a syncable element type
  if (['Checkboxes', 'RadioButtons', 'Dropdown', 'DataSource', 'Signature2', 'FormLink'].includes(item.element) && props.syncColumnChanges && props.editModeOn) {
    // Create an onElementChange handler for component-specific synchronization
    elementProps.onElementChange = function (changedData) {
      // Synchronize changes across the column
      props.syncColumnChanges(props.row, props.col, item.element, changedData);
    };
  }
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(Element, (0, _extends2.default)({}, elementProps, {
    key: "form_".concat(item.id),
    data: item
  })));
};
var isContainerItem = function isContainerItem(item) {
  if (item.itemType !== _ItemTypes.default.CARD) {
    var data = item.data;
    if (data) {
      return data.isContainer || data.field_name && data.field_name.includes('_col_row');
    }
  }
  return false;
};

// Main Component
var Dustbin = /*#__PURE__*/_react.default.forwardRef(function (_ref, ref) {
  var greedy = _ref.greedy,
    isOver = _ref.isOver,
    isOverCurrent = _ref.isOverCurrent,
    connectDropTarget = _ref.connectDropTarget,
    items = _ref.items,
    col = _ref.col,
    row = _ref.row,
    getDataById = _ref.getDataById,
    setAsChild = _ref.setAsChild,
    syncColumnChanges = _ref.syncColumnChanges,
    updateElement = _ref.updateElement,
    rest = (0, _objectWithoutProperties2.default)(_ref, _excluded);
  var item = getDataById(items[col]);

  // Handle drop operations
  (0, _react.useImperativeHandle)(ref, function () {
    return {
      onDrop: function onDrop(dropped) {
        if (dropped.data && typeof setAsChild === 'function') {
          var isNew = !dropped.data.id;
          var data = isNew ? dropped.onCreate(dropped.data) : dropped.data;
          setAsChild(rest.data, data, row, col);
        }
      }
    };
  }, [setAsChild, col, rest.data]);

  // Determine background color based on drag state
  var backgroundColor = isOverCurrent || isOver && greedy ? 'darkgreen' : 'rgba(0, 0, 0, .03)';
  var element = renderElement(item, _objectSpread(_objectSpread({}, rest), {}, {
    row: row,
    col: col,
    syncColumnChanges: syncColumnChanges,
    updateElement: updateElement
  }));
  return connectDropTarget( /*#__PURE__*/_react.default.createElement("div", {
    style: dustbinStyles(backgroundColor)
  }, element));
});

// Drop Target Configuration
var dropTargetSpec = {
  drop: function drop(props, monitor, component) {
    if (!component) return;
    var item = monitor.getItem();
    if (!isContainerItem(item)) {
      component.onDrop(item);
    }
  }
};
var collect = function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({
      shallow: true
    }),
    canDrop: monitor.canDrop()
  };
};
var _default = (0, _reactDnd.DropTarget)(function (props) {
  return props.accepts;
}, dropTargetSpec, collect)(Dustbin);
exports.default = _default;