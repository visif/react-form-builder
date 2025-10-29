"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _reactDnd = require("react-dnd");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _ItemTypes = _interopRequireDefault(require("./ItemTypes"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var cardStyle = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move'
};
var withDragAndDrop = function withDragAndDrop(ComposedComponent) {
  var Card = function Card(props) {
    var id = props.id,
      index = props.index,
      moveCard = props.moveCard,
      insertCard = props.insertCard,
      data = props.data,
      onCreate = props.onCreate,
      _props$seq = props.seq,
      seq = _props$seq === void 0 ? -1 : _props$seq;
    var ref = (0, _react.useRef)(null);
    var _useDrag = (0, _reactDnd.useDrag)(function () {
        return {
          type: _ItemTypes["default"].CARD,
          item: {
            itemType: _ItemTypes["default"].CARD,
            id: id,
            index: index
          },
          collect: function collect(monitor) {
            return {
              isDragging: monitor.isDragging()
            };
          }
        };
      }, [id, index]),
      _useDrag2 = (0, _slicedToArray2["default"])(_useDrag, 2),
      isDragging = _useDrag2[0].isDragging,
      drag = _useDrag2[1];
    var _useDrop = (0, _reactDnd.useDrop)(function () {
        return {
          accept: [_ItemTypes["default"].CARD, _ItemTypes["default"].BOX],
          drop: function drop(item, monitor) {
            if (!ref.current) return;
            var dragIndex = item.index;
            var hoverIndex = index;
            if (data.isContainer || item.itemType === _ItemTypes["default"].CARD) {
              return;
            }
            if (item.data && typeof item.setAsChild === 'function' && dragIndex === -1) {
              insertCard(item, hoverIndex, item.id);
            }
          },
          hover: function hover(item, monitor) {
            if (!ref.current) return;
            var dragIndex = item.index;
            var hoverIndex = index;
            if (item.data && typeof item.setAsChild === 'function') {
              return;
            }
            if (dragIndex === hoverIndex) {
              return;
            }
            if (dragIndex === -1) {
              if (data && data.isContainer) {
                return;
              }
              item.index = hoverIndex;
              insertCard(onCreate(item.data), hoverIndex);
            }
            var hoverBoundingRect = ref.current.getBoundingClientRect();
            var hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            var clientOffset = monitor.getClientOffset();
            var hoverClientY = clientOffset.y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
              return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
              return;
            }
            moveCard(dragIndex, hoverIndex);
            item.index = hoverIndex;
          }
        };
      }, [index, moveCard, insertCard, data, onCreate]),
      _useDrop2 = (0, _slicedToArray2["default"])(_useDrop, 2),
      drop = _useDrop2[1];

    // Combine drag and drop refs
    drag(drop(ref));
    var opacity = isDragging ? 0 : 1;
    return /*#__PURE__*/_react["default"].createElement("div", {
      ref: ref
    }, /*#__PURE__*/_react["default"].createElement(ComposedComponent, (0, _extends2["default"])({}, props, {
      style: _objectSpread(_objectSpread({}, cardStyle), {}, {
        opacity: opacity
      })
    })));
  };
  Card.propTypes = {
    index: _propTypes["default"].number.isRequired,
    id: _propTypes["default"].any.isRequired,
    moveCard: _propTypes["default"].func.isRequired,
    insertCard: _propTypes["default"].func,
    onCreate: _propTypes["default"].func,
    data: _propTypes["default"].object,
    seq: _propTypes["default"].number
  };
  Card.defaultProps = {
    seq: -1
  };
  return Card;
};
var _default = exports["default"] = withDragAndDrop;