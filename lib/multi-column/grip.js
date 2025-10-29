"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireDefault(require("react"));
var _reactDnd = require("react-dnd");
var _ItemTypes = _interopRequireDefault(require("../ItemTypes"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var style = {
  cursor: 'move'
};
var Grip = function Grip(props) {
  var data = props.data,
    index = props.index,
    onDestroy = props.onDestroy,
    setAsChild = props.setAsChild,
    getDataById = props.getDataById;
  var _useDrag = (0, _reactDnd.useDrag)(function () {
      return {
        type: _ItemTypes["default"].BOX,
        item: {
          itemType: _ItemTypes["default"].BOX,
          index: data.parentId ? -1 : index,
          parentIndex: data.parentIndex,
          id: data.id,
          col: data.col,
          onDestroy: onDestroy,
          setAsChild: setAsChild,
          getDataById: getDataById,
          data: data
        },
        collect: function collect(monitor) {
          return {
            isDragging: monitor.isDragging()
          };
        }
      };
    }, [data, index, onDestroy, setAsChild, getDataById]),
    _useDrag2 = (0, _slicedToArray2["default"])(_useDrag, 2),
    isDragging = _useDrag2[0].isDragging,
    drag = _useDrag2[1];
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: drag,
    className: "btn is-isolated",
    style: _objectSpread(_objectSpread({}, style), {}, {
      opacity: isDragging ? 0.5 : 1
    })
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "is-isolated fas fa-grip-vertical"
  }));
};
var _default = exports["default"] = Grip;