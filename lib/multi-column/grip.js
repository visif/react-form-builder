"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactDnd = require("react-dnd");
var _icons = require("@ant-design/icons");
var _ItemTypes = _interopRequireDefault(require("../ItemTypes"));
var style = {
  cursor: 'move'
};
var gripSource = {
  beginDrag: function beginDrag(props) {
    var data = props.data,
      index = props.index,
      onDestroy = props.onDestroy,
      setAsChild = props.setAsChild,
      getDataById = props.getDataById;
    return {
      itemType: _ItemTypes["default"].BOX,
      index: data.parentId ? -1 : index,
      parentIndex: data.parentIndex,
      id: data.id,
      col: data.col,
      onDestroy: onDestroy,
      setAsChild: setAsChild,
      getDataById: getDataById,
      data: data
    };
  }
};
var Grip = function Grip(_ref) {
  var connectDragSource = _ref.connectDragSource;
  return connectDragSource(/*#__PURE__*/_react["default"].createElement("div", {
    className: "btn is-isolated",
    style: style
  }, /*#__PURE__*/_react["default"].createElement(_icons.DragOutlined, {
    className: "vdc-ant-form-builder-icon is-isolated"
  })));
};
var _default = exports["default"] = (0, _reactDnd.DragSource)(_ItemTypes["default"].BOX, gripSource, function (connect) {
  return {
    connectDragSource: connect.dragSource()
  };
})(Grip);