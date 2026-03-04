"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactDnd = require("react-dnd");
var _ItemTypes = _interopRequireDefault(require("./ItemTypes"));
var _UUID = _interopRequireDefault(require("./UUID"));
/**
 * <ToolbarItem />
 */

const cardSource = {
  beginDrag(props) {
    return {
      id: _UUID.default.uuid(),
      index: -1,
      data: props.data,
      onCreate: props.onCreate
    };
  }
};
class ToolbarItem extends _react.default.Component {
  render() {
    const {
      connectDragSource,
      data,
      onClick
    } = this.props;
    if (!connectDragSource) return null;
    return connectDragSource(/*#__PURE__*/_react.default.createElement("li", {
      onClick: onClick
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: data.icon
    }), data.name));
  }
}
var _default = exports.default = (0, _reactDnd.DragSource)(_ItemTypes.default.CARD, cardSource, connect => ({
  connectDragSource: connect.dragSource()
}))(ToolbarItem);