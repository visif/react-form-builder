"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactDnd = require("react-dnd");
var _ItemTypes = _interopRequireDefault(require("../ItemTypes"));
const style = {
  // display: 'inline-block',
  // border: '1px dashed gray',
  // padding: '0.5rem 1rem',
  // backgroundColor: 'white',
  cursor: 'move'
};
const gripSource = {
  beginDrag(props) {
    const {
      data,
      index,
      onDestroy,
      setAsChild,
      getDataById
    } = props;
    return {
      itemType: _ItemTypes.default.BOX,
      index: data.parentId ? -1 : index,
      parentIndex: data.parentIndex,
      id: data.id,
      col: data.col,
      onDestroy,
      setAsChild,
      getDataById,
      data
    };
  }
};
const Grip = _ref => {
  let {
    connectDragSource
  } = _ref;
  return connectDragSource(/*#__PURE__*/_react.default.createElement("div", {
    className: "btn is-isolated",
    style: style
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "is-isolated fas fa-grip-vertical"
  })));
};
var _default = exports.default = (0, _reactDnd.DragSource)(_ItemTypes.default.BOX, gripSource, connect => ({
  connectDragSource: connect.dragSource()
}))(Grip);