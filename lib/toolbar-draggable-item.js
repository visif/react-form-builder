"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireDefault(require("react"));
var _reactDnd = require("react-dnd");
var _ItemTypes = _interopRequireDefault(require("./ItemTypes"));
var _UUID = _interopRequireDefault(require("./UUID"));
/**
 * <ToolbarItem />
 */

var ToolbarItem = function ToolbarItem(_ref) {
  var data = _ref.data,
    onClick = _ref.onClick,
    onCreate = _ref.onCreate;
  var _useDrag = (0, _reactDnd.useDrag)(function () {
      return {
        type: _ItemTypes["default"].CARD,
        item: function item() {
          return {
            id: _UUID["default"].uuid(),
            index: -1,
            data: data,
            onCreate: onCreate
          };
        },
        collect: function collect(monitor) {
          return {
            isDragging: monitor.isDragging()
          };
        }
      };
    }, [data, onCreate]),
    _useDrag2 = (0, _slicedToArray2["default"])(_useDrag, 2),
    isDragging = _useDrag2[0].isDragging,
    connectDragSource = _useDrag2[1];
  if (!connectDragSource) return null;
  return connectDragSource(/*#__PURE__*/_react["default"].createElement("li", {
    onClick: onClick,
    style: {
      opacity: isDragging ? 0.5 : 1
    }
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: data.icon
  }), data.name));
};
var _default = exports["default"] = ToolbarItem;