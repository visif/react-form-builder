"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _reactDnd = require("react-dnd");
var _formElements = _interopRequireDefault(require("../form-elements"));
var _customElement = _interopRequireDefault(require("../form-elements/custom-element"));
var _ItemTypes = _interopRequireDefault(require("../ItemTypes"));
var _registry = _interopRequireDefault(require("../stores/registry"));
var _excluded = ["greedy", "items", "col", "row", "getDataById", "setAsChild", "syncColumnChanges", "updateElement", "accepts"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
// Styles
var dustbinStyles = function dustbinStyles(backgroundColor) {
  return {
    border: '1px solid rgba(0,0,0,0.2)',
    minHeight: '2rem',
    width: '100%',
    backgroundColor: backgroundColor,
    padding: 0,
    "float": 'left'
  };
};

// Helper Functions
var renderCustomElement = function renderCustomElement(item, props) {
  if (!item.component || typeof item.component !== 'function') {
    item.component = _registry["default"].get(item.key);
    if (!item.component) {
      console.error("".concat(item.element, " was not registered"));
    }
  }
  return /*#__PURE__*/_react["default"].createElement(_customElement["default"], (0, _extends2["default"])({}, props, {
    mutable: false,
    key: "form_".concat(item.id),
    data: item
  }));
};
var renderElement = function renderElement(item, props) {
  if (!item) return null;
  var Element = item.custom ? function () {
    return renderCustomElement(item, props);
  } : _formElements["default"][item.element || item.key];

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
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(Element, (0, _extends2["default"])({}, elementProps, {
    key: "form_".concat(item.id),
    data: item
  })));
};
var isContainerItem = function isContainerItem(item) {
  if (item.itemType !== _ItemTypes["default"].CARD) {
    var data = item.data;
    if (data) {
      return data.isContainer || data.field_name && data.field_name.includes('_col_row');
    }
  }
  return false;
};

// Main Component
var Dustbin = /*#__PURE__*/_react["default"].forwardRef(function (_ref, ref) {
  var greedy = _ref.greedy,
    items = _ref.items,
    col = _ref.col,
    row = _ref.row,
    getDataById = _ref.getDataById,
    setAsChild = _ref.setAsChild,
    syncColumnChanges = _ref.syncColumnChanges,
    updateElement = _ref.updateElement,
    accepts = _ref.accepts,
    rest = (0, _objectWithoutProperties2["default"])(_ref, _excluded);
  var item = getDataById(items[col]);
  var _useDrop = (0, _reactDnd.useDrop)(function () {
      return {
        accept: accepts,
        drop: function drop(droppedItem, monitor) {
          if (!isContainerItem(droppedItem)) {
            if (droppedItem.data && typeof setAsChild === 'function') {
              var isNew = !droppedItem.data.id;
              var data = isNew ? droppedItem.onCreate(droppedItem.data) : droppedItem.data;
              setAsChild(rest.data, data, row, col);
            }
          }
        },
        collect: function collect(monitor) {
          return {
            isOver: monitor.isOver(),
            isOverCurrent: monitor.isOver({
              shallow: true
            }),
            canDrop: monitor.canDrop()
          };
        }
      };
    }, [accepts, setAsChild, col, row, rest.data]),
    _useDrop2 = (0, _slicedToArray2["default"])(_useDrop, 2),
    _useDrop2$ = _useDrop2[0],
    isOver = _useDrop2$.isOver,
    isOverCurrent = _useDrop2$.isOverCurrent,
    canDrop = _useDrop2$.canDrop,
    drop = _useDrop2[1];

  // Handle drop operations (legacy interface)
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
  }, [setAsChild, col, row, rest.data]);

  // Determine background color based on drag state
  var backgroundColor = isOverCurrent || isOver && greedy ? 'darkgreen' : 'rgba(0, 0, 0, .03)';
  var element = renderElement(item, _objectSpread(_objectSpread({}, rest), {}, {
    row: row,
    col: col,
    syncColumnChanges: syncColumnChanges,
    updateElement: updateElement
  }));
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: drop,
    style: dustbinStyles(backgroundColor)
  }, element);
});
var _default = exports["default"] = Dustbin;